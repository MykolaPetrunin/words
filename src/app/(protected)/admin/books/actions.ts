'use server';

import { revalidatePath } from 'next/cache';
import { del, put } from '@vercel/blob';

import { appPaths, getAdminBookPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import { createBook, getBookWithRelations, updateBook, updateBookCover, type BookInput, type DbBookWithRelations } from '@/lib/repositories/bookRepository';
import { createTopic, deleteTopicWithQuestions, getTopicById, type DbTopic } from '@/lib/repositories/topicRepository';

import { getBookTopicsSuggestions } from './components/bookTopicSuggestionsDialog/aiActions';
import { bookFormSchema, bookTopicFormSchema, type BookFormData, type BookTopicFormData } from './schemas';

const mapFormToInput = (data: BookFormData): BookInput => ({
    titleUk: data.titleUk,
    titleEn: data.titleEn,
    descriptionUk: data.descriptionUk.length > 0 ? data.descriptionUk : null,
    descriptionEn: data.descriptionEn.length > 0 ? data.descriptionEn : null,
    coverUrl: typeof data.coverUrl === 'string' && data.coverUrl.length > 0 ? data.coverUrl : null,
    isActive: data.isActive,
    subjectIds: Array.from(new Set(data.subjectIds)),
    topicIds: Array.from(new Set(data.topicIds))
});

const revalidateAdminBooks = (): void => {
    revalidatePath(appPaths.admin);
    revalidatePath(appPaths.adminBooks);
    revalidatePath(appPaths.adminQuestions);
};

export async function createAdminBook(data: BookFormData): Promise<DbBookWithRelations> {
    const parsed = bookFormSchema.parse(data);
    const book = await createBook(mapFormToInput(parsed));
    revalidateAdminBooks();
    return book;
}

export async function updateAdminBook(bookId: string, data: BookFormData): Promise<DbBookWithRelations> {
    const parsed = bookFormSchema.parse(data);
    const book = await updateBook(bookId, mapFormToInput(parsed));
    revalidateAdminBooks();
    revalidatePath(getAdminBookPath(bookId));
    return book;
}

const allowedCoverMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const maxCoverSizeBytes = 5 * 1024 * 1024;

const deleteBookCoverBlob = async (url: string): Promise<void> => {
    try {
        await del(url);
    } catch (error) {
        serverLogger.error('Failed to delete book cover blob', error as Error, { url });
    }
};

export interface BookCoverUploadResult {
    url: string;
    book: DbBookWithRelations;
}

export async function uploadAdminBookCover(bookId: string, formData: FormData): Promise<BookCoverUploadResult> {
    const file = formData.get('file');
    if (!(file instanceof File)) {
        throw new Error('file-required');
    }
    if (!allowedCoverMimeTypes.has(file.type)) {
        throw new Error('invalid-type');
    }
    if (file.size > maxCoverSizeBytes) {
        throw new Error('file-too-large');
    }
    const existing = await getBookWithRelations(bookId);
    if (!existing) {
        throw new Error('book-not-found');
    }
    const objectName = `books/${crypto.randomUUID()}-${file.name}`;
    const blob = await put(objectName, file, { access: 'public', addRandomSuffix: false, contentType: file.type });
    const updatedBook = await updateBookCover(bookId, blob.url);
    revalidateAdminBooks();
    revalidatePath(getAdminBookPath(bookId));
    if (existing.coverUrl && existing.coverUrl !== blob.url) {
        await deleteBookCoverBlob(existing.coverUrl);
    }
    return { url: blob.url, book: updatedBook };
}

export interface BookCoverDeleteResult {
    book: DbBookWithRelations;
}

export async function deleteAdminBookCover(bookId: string): Promise<BookCoverDeleteResult> {
    const existing = await getBookWithRelations(bookId);
    if (!existing) {
        throw new Error('book-not-found');
    }
    const urlToDelete = existing.coverUrl;
    const updatedBook = await updateBookCover(bookId, null);
    revalidateAdminBooks();
    revalidatePath(getAdminBookPath(bookId));
    if (urlToDelete) {
        await deleteBookCoverBlob(urlToDelete);
    }
    return { book: updatedBook };
}

export async function createAdminBookTopic(bookId: string, data: BookTopicFormData): Promise<DbTopic> {
    const parsed = bookTopicFormSchema.parse(data);
    const topic = await createTopic({
        bookId,
        titleUk: parsed.titleUk,
        titleEn: parsed.titleEn
    });
    revalidateAdminBooks();
    return topic;
}

export type TopicSuggestionPriority = 'strong' | 'optional';

export interface TopicSuggestionExisting {
    id: string;
    titleUk: string;
    titleEn: string;
    reason: string;
    priority: TopicSuggestionPriority;
}

export interface TopicSuggestionNew {
    titleUk: string;
    titleEn: string;
    reason: string;
    priority: TopicSuggestionPriority;
}

export type TopicSuggestionStatus = 'needs_topics' | 'covered';

export interface TopicSuggestions {
    status: TopicSuggestionStatus;
    existingTopics: TopicSuggestionExisting[];
    newTopics: TopicSuggestionNew[];
}

export interface TopicSuggestionSuccess {
    success: true;
    data: TopicSuggestions;
}

export type TopicSuggestionErrorCode =
    | 'openai_api_key_missing'
    | 'book_not_found'
    | 'request_failed'
    | 'empty_response'
    | 'invalid_response'
    | 'quota_exceeded'
    | 'response_truncated';

export interface TopicSuggestionFailure {
    success: false;
    code: TopicSuggestionErrorCode;
    message: string;
    details?: Record<string, unknown>;
}

export type TopicSuggestionResult = TopicSuggestionFailure | TopicSuggestionSuccess;

interface SuggestionFailParams {
    code: TopicSuggestionErrorCode;
    message: string;
    error?: Error;
    context?: Record<string, unknown>;
}

export async function generateAdminBookTopicSuggestions(bookId: string): Promise<TopicSuggestionResult> {
    const fail = ({ code, message, error, context }: SuggestionFailParams): TopicSuggestionFailure => {
        serverLogger.error(message, error, { bookId, code, ...(context ?? {}) });
        return {
            success: false,
            code,
            message,
            ...(context ? { details: context } : {})
        };
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return fail({ code: 'openai_api_key_missing', message: 'OpenAI API key is not configured.' });
    }

    const book = await getBookWithRelations(bookId);
    if (!book) {
        return fail({ code: 'book_not_found', message: 'Book not found.' });
    }

    try {
        const suggestions = await getBookTopicsSuggestions(book);
        if (!suggestions) {
            return {
                success: true,
                data: {
                    status: 'covered',
                    existingTopics: [],
                    newTopics: []
                }
            };
        }

        const newTopics: TopicSuggestionNew[] = suggestions.map((topic) => ({
            titleUk: topic.titleUk,
            titleEn: topic.titleEn,
            reason: topic.reason,
            priority: topic.isOptional ? 'optional' : 'strong'
        }));

        const status: TopicSuggestionStatus = newTopics.length === 0 ? 'covered' : 'needs_topics';

        return {
            success: true,
            data: {
                status,
                existingTopics: [],
                newTopics
            }
        };
    } catch (error) {
        return fail({ code: 'request_failed', message: 'Failed to generate topic suggestions.', error: error as Error });
    }
}

export async function createAdminBookTopics(bookId: string, data: readonly BookTopicFormData[]): Promise<DbTopic[]> {
    if (data.length === 0) {
        return [];
    }

    const createdTopics: DbTopic[] = [];
    for (const item of data) {
        const parsed = bookTopicFormSchema.parse(item);
        const topic = await createTopic({
            bookId,
            titleUk: parsed.titleUk,
            titleEn: parsed.titleEn
        });
        createdTopics.push(topic);
    }
    revalidateAdminBooks();
    return createdTopics;
}

export async function deleteAdminBookTopic(bookId: string, topicId: string): Promise<void> {
    const topic = await getTopicById(topicId);
    if (!topic || topic.bookId !== bookId) {
        serverLogger.error('Topic delete failed', undefined, { bookId, topicId, reason: 'not_found' });
        throw new Error('Topic not found');
    }
    try {
        await deleteTopicWithQuestions(topicId);
    } catch (error) {
        serverLogger.error('Topic delete failed', error as Error, { bookId, topicId });
        throw error;
    }
    revalidateAdminBooks();
    revalidatePath(getAdminBookPath(bookId));
}
