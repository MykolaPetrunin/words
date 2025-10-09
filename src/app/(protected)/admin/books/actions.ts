'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { appPaths, getAdminBookPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import { createBook, getBookWithRelations, updateBook, type BookInput, type DbBookWithRelations } from '@/lib/repositories/bookRepository';
import { createTopic, type DbTopic } from '@/lib/repositories/topicRepository';

import { bookFormSchema, bookTopicFormSchema, type BookFormData, type BookTopicFormData } from './schemas';

const mapFormToInput = (data: BookFormData): BookInput => ({
    titleUk: data.titleUk,
    titleEn: data.titleEn,
    descriptionUk: data.descriptionUk.length > 0 ? data.descriptionUk : null,
    descriptionEn: data.descriptionEn.length > 0 ? data.descriptionEn : null,
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

export async function createAdminBookTopic(data: BookTopicFormData): Promise<DbTopic> {
    const parsed = bookTopicFormSchema.parse(data);
    const topic = await createTopic({
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

export interface TopicSuggestionSuccess {
    success: true;
    data: TopicSuggestions;
}

export type TopicSuggestionResult = TopicSuggestionFailure | TopicSuggestionSuccess;

const suggestionResponseSchema = z
    .object({
        status: z.enum(['needs_topics', 'covered']).optional().default('needs_topics'),
        existingTopics: z
            .array(
                z.object({
                    id: z.string().min(1),
                    reason: z.string().min(1),
                    priority: z.enum(['strong', 'optional']).default('strong')
                })
            )
            .optional()
            .default([]),
        newTopics: z
            .array(
                z.object({
                    titleUk: z.string().min(1),
                    titleEn: z.string().min(1),
                    reason: z.string().min(1),
                    priority: z.enum(['strong', 'optional']).default('strong')
                })
            )
            .optional()
            .default([])
    })
    .strict();

type FailParams = {
    code: TopicSuggestionErrorCode;
    message: string;
    error?: Error;
    context?: Record<string, unknown>;
};

export async function generateAdminBookTopicSuggestions(bookId: string): Promise<TopicSuggestionResult> {
    const fail = ({ code, message, error, context }: FailParams): TopicSuggestionFailure => {
        serverLogger.error(message, error, { bookId, code, ...context });
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

    const bookResult = await getBookWithRelations(bookId);
    if (!bookResult) {
        return fail({ code: 'book_not_found', message: 'Book not found.' });
    }
    const book = bookResult;

    const truncate = (value: string | null | undefined): string | null => {
        if (!value) {
            return null;
        }
        return value.trim().slice(0, 2000);
    };

    const existingTopicsMap = new Map(book.topics.map((topic) => [topic.id, topic]));
    const payload = {
        book: {
            titleUk: truncate(book.titleUk),
            titleEn: truncate(book.titleEn),
            descriptionUk: truncate(book.descriptionUk),
            descriptionEn: truncate(book.descriptionEn),
            subjects: book.subjects.slice(0, 100).map((subject) => ({
                nameUk: truncate(subject.nameUk),
                nameEn: truncate(subject.nameEn)
            })),
            currentTopics: book.topics.slice(0, 100).map((topic) => ({
                id: topic.id,
                titleUk: truncate(topic.titleUk),
                titleEn: truncate(topic.titleEn)
            }))
        }
    };

    const apiUrl = process.env.OPENAI_API_URL!;
    const payloadJson = JSON.stringify(payload);
    const userMessage = `Return a compact JSON object that strictly matches the schema. Do not include markdown fences or commentary. Provide at most five new topics. Mark each topic as \"strong\" if it is essential for senior-level coverage, otherwise \"optional\". If the book is already fully covered, set status to \"covered\" and leave arrays empty.\nSchema: { "status": "needs_topics" | "covered", "existingTopics": [{ "id": string, "reason": string, "priority": "strong" | "optional" }], "newTopics": [{ "titleUk": string, "titleEn": string, "reason": string, "priority": "strong" | "optional" }] }\nData: ${payloadJson}`;

    const requestTimeoutMs = 240000;
    const completionBudgets: readonly number[] = [2048, 3072];
    let lastTruncationContext: Record<string, unknown> | undefined;

    const executeRequest = async (maxTokens: number): Promise<Response> => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
        try {
            return await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-5-mini',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'You are an experienced senior software engineer who curates learning roadmaps. Respond ONLY with a compact JSON object that matches the provided schema.'
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    response_format: {
                        type: 'json_object'
                    },
                    max_completion_tokens: maxTokens
                }),
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeout);
        }
    };

    for (const maxTokens of completionBudgets) {
        let response: Response;
        try {
            response = await executeRequest(maxTokens);
        } catch (error) {
            return fail({ code: 'request_failed', message: 'Failed to generate topic suggestions.', error: error as Error });
        }

        if (!response.ok) {
            const errorText = await response.text();
            let details: unknown = errorText;
            try {
                details = JSON.parse(errorText);
            } catch (parseError) {
                serverLogger.warn('OpenAI error response not JSON.', {
                    bookId,
                    status: response.status,
                    parseError: parseError instanceof Error ? parseError.message : String(parseError)
                });
            }
            let code: TopicSuggestionErrorCode = 'request_failed';
            let message = 'Failed to generate topic suggestions.';
            if (response.status === 429) {
                code = 'quota_exceeded';
                message = 'OpenAI quota exceeded.';
            }

            return fail({ code, message, context: { status: response.status, details, maxTokens } });
        }

        let json: {
            choices?: Array<{ message?: { content?: string | null }; finish_reason?: string | null }>;
        };
        try {
            json = (await response.json()) as {
                choices?: Array<{ message?: { content?: string | null }; finish_reason?: string | null }>;
            };
        } catch (error) {
            return fail({
                code: 'invalid_response',
                message: 'Unable to parse OpenAI suggestions.',
                error: error as Error,
                context: { maxTokens }
            });
        }

        const choice = json.choices?.[0];
        const finishReason = choice?.finish_reason ?? null;
        const content = choice?.message?.content;

        if (!content || content.trim().length === 0) {
            if (finishReason === 'length') {
                lastTruncationContext = { finishReason, maxTokens };
                continue;
            }
            return fail({ code: 'empty_response', message: 'OpenAI response is empty.', context: { maxTokens } });
        }

        const normalized = content.replace(/```json|```/g, '').trim();

        let parsedJson: unknown;
        try {
            parsedJson = JSON.parse(normalized);
        } catch (error) {
            if (finishReason === 'length') {
                lastTruncationContext = {
                    finishReason,
                    maxTokens,
                    contentSample: normalized.slice(0, 200)
                };
                continue;
            }
            return fail({
                code: 'invalid_response',
                message: 'Unable to parse OpenAI suggestions.',
                error: error as Error,
                context: { content: normalized.slice(0, 2000), maxTokens }
            });
        }

        const parsedResult = suggestionResponseSchema.safeParse(parsedJson);
        if (!parsedResult.success) {
            if (finishReason === 'length') {
                lastTruncationContext = {
                    finishReason,
                    maxTokens,
                    contentSample: normalized.slice(0, 200)
                };
                continue;
            }
            return fail({
                code: 'invalid_response',
                message: 'Unable to parse OpenAI suggestions.',
                error: parsedResult.error,
                context: { content: normalized.slice(0, 2000), maxTokens }
            });
        }

        const parsed = parsedResult.data;

        const existingTopics: TopicSuggestionExisting[] = parsed.existingTopics
            .map((item) => {
                const topic = existingTopicsMap.get(item.id);
                if (!topic) {
                    return null;
                }
                const suggestion: TopicSuggestionExisting = {
                    id: topic.id,
                    titleUk: topic.titleUk,
                    titleEn: topic.titleEn,
                    reason: item.reason,
                    priority: item.priority
                };
                return suggestion;
            })
            .filter((value): value is TopicSuggestionExisting => value !== null);

        const newTopics: TopicSuggestionNew[] = parsed.newTopics.map((item) => ({
            titleUk: item.titleUk,
            titleEn: item.titleEn,
            reason: item.reason,
            priority: item.priority
        }));

        return {
            success: true,
            data: {
                status: parsed.status,
                existingTopics,
                newTopics
            }
        };
    }

    return fail({
        code: 'response_truncated',
        message: 'OpenAI response was truncated before completion.',
        context: lastTruncationContext ?? { attempts: completionBudgets }
    });
}

export async function createAdminBookTopics(data: readonly BookTopicFormData[]): Promise<DbTopic[]> {
    if (data.length === 0) {
        return [];
    }

    const createdTopics: DbTopic[] = [];
    for (const item of data) {
        const parsed = bookTopicFormSchema.parse(item);
        const topic = await createTopic({
            titleUk: parsed.titleUk,
            titleEn: parsed.titleEn
        });
        createdTopics.push(topic);
    }
    revalidateAdminBooks();
    return createdTopics;
}
