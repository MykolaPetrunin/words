import prisma from '@/lib/prisma';

export interface DbTopic {
    id: string;
    bookId: string;
    titleUk: string;
    titleEn: string;
}

export interface TopicInput {
    bookId: string;
    titleUk: string;
    titleEn: string;
}

type TopicRow = {
    id: string;
    bookId: string;
    titleUk: string;
    titleEn: string;
};

const mapToDbTopic = (topic: TopicRow): DbTopic => ({
    id: topic.id,
    bookId: topic.bookId,
    titleUk: topic.titleUk,
    titleEn: topic.titleEn
});

export async function getAllTopics(): Promise<DbTopic[]> {
    const rows = await prisma.topic.findMany({
        orderBy: {
            titleUk: 'asc'
        }
    });
    return rows.map((topic) => mapToDbTopic(topic));
}

export async function getTopicsForBook(bookId: string): Promise<DbTopic[]> {
    const rows = await prisma.topic.findMany({
        where: {
            bookId
        },
        orderBy: {
            titleUk: 'asc'
        }
    });
    return rows.map((topic) => mapToDbTopic(topic));
}

export async function createTopic(input: TopicInput): Promise<DbTopic> {
    const topic = await prisma.topic.create({
        data: {
            bookId: input.bookId,
            titleUk: input.titleUk,
            titleEn: input.titleEn
        }
    });
    return mapToDbTopic(topic);
}
