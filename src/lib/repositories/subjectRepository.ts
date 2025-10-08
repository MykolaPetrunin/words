import prisma from '@/lib/prisma';

export interface DbSubject {
    id: string;
    nameUk: string;
    nameEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubjectInput {
    nameUk: string;
    nameEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    isActive: boolean;
}

export async function getAllActiveSubjects(): Promise<DbSubject[]> {
    const rows = await prisma.subject.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
    });
    return rows.map(mapToDbSubject);
}

export async function getAllSubjects(): Promise<DbSubject[]> {
    const rows = await prisma.subject.findMany({
        orderBy: { createdAt: 'asc' }
    });
    return rows.map(mapToDbSubject);
}

export async function getSubjectById(id: string): Promise<DbSubject | null> {
    const subject = await prisma.subject.findFirst({
        where: {
            id,
            isActive: true
        }
    });
    return subject ? mapToDbSubject(subject) : null;
}

export async function createSubject(input: SubjectInput): Promise<DbSubject> {
    const subject = await prisma.subject.create({
        data: {
            nameUk: input.nameUk,
            nameEn: input.nameEn,
            descriptionUk: input.descriptionUk,
            descriptionEn: input.descriptionEn,
            isActive: input.isActive
        }
    });
    return mapToDbSubject(subject);
}

export async function updateSubject(id: string, input: SubjectInput): Promise<DbSubject> {
    const subject = await prisma.subject.update({
        where: { id },
        data: {
            nameUk: input.nameUk,
            nameEn: input.nameEn,
            descriptionUk: input.descriptionUk,
            descriptionEn: input.descriptionEn,
            isActive: input.isActive
        }
    });
    return mapToDbSubject(subject);
}

const mapToDbSubject = (s: unknown): DbSubject => {
    const base = s as DbSubject;
    return {
        id: base.id,
        nameUk: base.nameUk,
        nameEn: base.nameEn,
        descriptionUk: base.descriptionUk,
        descriptionEn: base.descriptionEn,
        isActive: base.isActive,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
    };
};
