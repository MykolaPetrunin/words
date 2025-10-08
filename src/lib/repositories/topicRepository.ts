import prisma from '@/lib/prisma';

export interface DbTopic {
    id: string;
    titleUk: string;
    titleEn: string;
}

export async function getAllTopics(): Promise<DbTopic[]> {
    const rows = await prisma.topic.findMany({
        orderBy: {
            titleUk: 'asc'
        }
    });
    return rows.map((topic) => ({
        id: topic.id,
        titleUk: topic.titleUk,
        titleEn: topic.titleEn
    }));
}
