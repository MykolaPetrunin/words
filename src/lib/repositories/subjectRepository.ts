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
