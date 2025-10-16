import type { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export interface DbTopic {
    id: string;
    bookId: string;
    titleUk: string;
    titleEn: string;
}

export interface DbTopicWithProcessing extends DbTopic {
    isProcessing: boolean;
    processingStartedAt: Date | null;
}

export interface DbTopicWithStats extends DbTopic {
    totalQuestions: number;
    activeQuestions: number;
    inactiveQuestions: number;
    previewQuestions: number;
    questionsWithoutAnswers: number;
    isProcessing: boolean;
    processingStartedAt: Date | null;
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

type _TopicWithStatsRow = Prisma.TopicGetPayload<{
    include: {
        questions: {
            select: {
                isActive: true;
                previewMode: true;
                _count: {
                    select: {
                        answers: true;
                    };
                };
            };
        };
    };
}>;

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

export async function getTopicsForBookWithStats(bookId: string): Promise<DbTopicWithStats[]> {
    const topics = await prisma.topic.findMany({
        where: {
            bookId
        },
        include: {
            questions: {
                select: {
                    isActive: true,
                    previewMode: true,
                    _count: {
                        select: {
                            answers: true
                        }
                    }
                }
            }
        },
        orderBy: {
            titleUk: 'asc'
        }
    });

    return topics.map((topic) => {
        const totalQuestions = topic.questions.length;
        const activeQuestions = topic.questions.filter((q) => q.isActive && !q.previewMode).length;
        const inactiveQuestions = topic.questions.filter((q) => !q.isActive).length;
        const previewQuestions = topic.questions.filter((q) => q.previewMode).length;
        const questionsWithoutAnswers = topic.questions.filter((q) => q._count.answers === 0).length;

        return {
            id: topic.id,
            bookId: topic.bookId,
            titleUk: topic.titleUk,
            titleEn: topic.titleEn,
            totalQuestions,
            activeQuestions,
            inactiveQuestions,
            previewQuestions,
            questionsWithoutAnswers,
            isProcessing: topic.isProcessing,
            processingStartedAt: topic.processingStartedAt
        };
    });
}

export async function getTopicById(topicId: string): Promise<DbTopic | null> {
    const topic = await prisma.topic.findUnique({
        where: {
            id: topicId
        }
    });
    if (!topic) {
        return null;
    }
    return mapToDbTopic(topic);
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

export async function deleteTopicWithQuestions(topicId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
        await tx.question.deleteMany({
            where: {
                topicId
            }
        });
        await tx.topic.delete({
            where: {
                id: topicId
            }
        });
    });
}

export async function setTopicProcessing(topicId: string, isProcessing: boolean, startedAt?: Date): Promise<void> {
    await prisma.topic.update({
        where: {
            id: topicId
        },
        data: {
            isProcessing,
            processingStartedAt: isProcessing ? (startedAt ?? new Date()) : null
        }
    });
}

export async function getTopicWithProcessingStatus(topicId: string): Promise<DbTopicWithProcessing | null> {
    const topic = await prisma.topic.findUnique({
        where: {
            id: topicId
        }
    });
    if (!topic) {
        return null;
    }
    return {
        id: topic.id,
        bookId: topic.bookId,
        titleUk: topic.titleUk,
        titleEn: topic.titleEn,
        isProcessing: topic.isProcessing,
        processingStartedAt: topic.processingStartedAt
    };
}
