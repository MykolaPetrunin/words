'use server';

import { revalidatePath } from 'next/cache';
import { del, put } from '@vercel/blob';

import { appPaths, getAdminSubjectPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import { createSubject, getSubjectByIdForAdmin, updateSubject, updateSubjectCover, type DbSubject, type SubjectInput } from '@/lib/repositories/subjectRepository';

import { subjectFormSchema, type SubjectFormData } from './schemas';

const mapFormToInput = (data: SubjectFormData): SubjectInput => ({
    nameUk: data.nameUk,
    nameEn: data.nameEn,
    descriptionUk: data.descriptionUk.length > 0 ? data.descriptionUk : null,
    descriptionEn: data.descriptionEn.length > 0 ? data.descriptionEn : null,
    coverUrl: typeof data.coverUrl === 'string' && data.coverUrl.length > 0 ? data.coverUrl : null,
    isActive: data.isActive
});

const revalidateAdminSubjects = (subjectId?: string): void => {
    revalidatePath(appPaths.admin);
    revalidatePath(appPaths.adminSubjects);
    revalidatePath(appPaths.adminBooks);
    revalidatePath(appPaths.adminQuestions);
    revalidatePath(appPaths.dashboard);
    revalidatePath(appPaths.subjects);
    if (subjectId) {
        revalidatePath(getAdminSubjectPath(subjectId));
    }
};

export async function createAdminSubject(data: SubjectFormData): Promise<DbSubject> {
    const parsed = subjectFormSchema.parse(data);
    const subject = await createSubject(mapFormToInput(parsed));
    revalidateAdminSubjects(subject.id);
    return subject;
}

export async function updateAdminSubject(subjectId: string, data: SubjectFormData): Promise<DbSubject> {
    const parsed = subjectFormSchema.parse(data);
    const subject = await updateSubject(subjectId, mapFormToInput(parsed));
    revalidateAdminSubjects(subject.id);
    return subject;
}

const allowedCoverMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const maxCoverSizeBytes = 5 * 1024 * 1024;

const deleteBlobIfExists = async (url: string): Promise<void> => {
    try {
        await del(url);
    } catch (error) {
        serverLogger.error('Failed to delete subject cover blob', error as Error, { url });
    }
};

export interface SubjectCoverUploadResult {
    url: string;
    subject?: DbSubject;
}

export async function uploadAdminSubjectCover(formData: FormData, subjectId?: string | null): Promise<SubjectCoverUploadResult> {
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
    const objectName = `subjects/${crypto.randomUUID()}-${file.name}`;
    const blob = await put(objectName, file, { access: 'public', addRandomSuffix: false, contentType: file.type });
    let updatedSubject: DbSubject | null = null;
    if (subjectId) {
        const existing = await getSubjectByIdForAdmin(subjectId);
        updatedSubject = await updateSubjectCover(subjectId, blob.url);
        revalidateAdminSubjects(subjectId);
        if (existing?.coverUrl && existing.coverUrl !== blob.url) {
            await deleteBlobIfExists(existing.coverUrl);
        }
    }
    return { url: blob.url, subject: updatedSubject ?? undefined };
}

export interface SubjectCoverDeleteResult {
    subject: DbSubject;
}

export async function deleteAdminSubjectCover(subjectId: string): Promise<SubjectCoverDeleteResult> {
    const existing = await getSubjectByIdForAdmin(subjectId);
    if (!existing) {
        throw new Error('subject-not-found');
    }
    const urlToDelete = existing.coverUrl;
    const updatedSubject = await updateSubjectCover(subjectId, null);
    revalidateAdminSubjects(subjectId);
    if (urlToDelete) {
        await deleteBlobIfExists(urlToDelete);
    }
    return { subject: updatedSubject };
}
