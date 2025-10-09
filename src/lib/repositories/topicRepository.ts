import prisma from '@/lib/prisma';

export interface DbTopic {
    id: string;
    titleUk: string;
    titleEn: string;
}

export interface TopicInput {
    titleUk: string;
    titleEn: string;
}

type TopicRow = {
    id: string;
    titleUk: string;
    titleEn: string;
};

const mapToDbTopic = (topic: TopicRow): DbTopic => ({
    id: topic.id,
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
            OR: [
                {
                    bookTopics: {
                        some: {
                            bookId
                        }
                    }
                },
                {
                    questions: {
                        some: {
                            bookQuestions: {
                                some: {
                                    bookId
                                }
                            }
                        }
                    }
                }
            ]
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
            titleUk: input.titleUk,
            titleEn: input.titleEn
        }
    });
    return mapToDbTopic(topic);
}
