'use server';

import { revalidatePath } from 'next/cache';

import { appPaths, getAdminBookPath } from '@/lib/appPaths';
import { createBook, updateBook, type BookInput, type DbBookWithRelations } from '@/lib/repositories/bookRepository';
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
