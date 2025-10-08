'use server';

import { revalidatePath } from 'next/cache';

import { appPaths } from '@/lib/appPaths';
import { createSubject, updateSubject, type DbSubject, type SubjectInput } from '@/lib/repositories/subjectRepository';

import { subjectFormSchema, type SubjectFormData } from './schemas';

const mapFormToInput = (data: SubjectFormData): SubjectInput => ({
    nameUk: data.nameUk,
    nameEn: data.nameEn,
    descriptionUk: data.descriptionUk.length > 0 ? data.descriptionUk : null,
    descriptionEn: data.descriptionEn.length > 0 ? data.descriptionEn : null,
    isActive: data.isActive
});

const revalidateAdminSubjects = (): void => {
    revalidatePath(appPaths.admin);
    revalidatePath(appPaths.adminSubjects);
    revalidatePath(appPaths.adminBooks);
    revalidatePath(appPaths.adminQuestions);
    revalidatePath(appPaths.dashboard);
    revalidatePath(appPaths.subjects);
};

export async function createAdminSubject(data: SubjectFormData): Promise<DbSubject> {
    const parsed = subjectFormSchema.parse(data);
    const subject = await createSubject(mapFormToInput(parsed));
    revalidateAdminSubjects();
    return subject;
}

export async function updateAdminSubject(subjectId: string, data: SubjectFormData): Promise<DbSubject> {
    const parsed = subjectFormSchema.parse(data);
    const subject = await updateSubject(subjectId, mapFormToInput(parsed));
    revalidateAdminSubjects();
    return subject;
}
