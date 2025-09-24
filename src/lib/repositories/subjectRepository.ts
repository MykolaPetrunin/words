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

export async function getAllActiveSubjects(): Promise<DbSubject[]> {
    const rows = await prisma.subject.findMany({
        where: { isActive: true },
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
