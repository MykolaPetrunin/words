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

type TopicStatsRow = {
    id: string;
    book_id: string;
    title_uk: string;
    title_en: string;
    total_questions: number;
    active_questions: number;
    inactive_questions: number;
    preview_questions: number;
    questions_without_answers: number;
    is_processing: boolean;
    processing_started_at: Date | null;
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

export async function getTopicsForBookWithStats(bookId: string): Promise<DbTopicWithStats[]> {
    const rows = await prisma.$queryRaw<TopicStatsRow[]>`
        WITH answer_counts AS (
            SELECT question_id, COUNT(*)::int AS total_answers
            FROM answers
            GROUP BY question_id
        )
        SELECT
            t.id,
            t.book_id,
            t.title_uk,
            t.title_en,
            COALESCE(COUNT(q.id), 0)::int AS total_questions,
            COALESCE(SUM(CASE WHEN q.is_active = true AND q.preview_mode = false THEN 1 ELSE 0 END), 0)::int AS active_questions,
            COALESCE(
                SUM(
                    CASE
                        WHEN q.is_active = false AND q.preview_mode = false AND COALESCE(ac.total_answers, 0) > 0 THEN 1
                        ELSE 0
                    END
                ),
                0
            )::int AS inactive_questions,
            COALESCE(SUM(CASE WHEN q.preview_mode = true THEN 1 ELSE 0 END), 0)::int AS preview_questions,
            COALESCE(
                SUM(
                    CASE
                        WHEN q.id IS NOT NULL AND COALESCE(ac.total_answers, 0) = 0 THEN 1
                        ELSE 0
                    END
                ),
                0
            )::int AS questions_without_answers,
            t.is_processing,
            t.processing_started_at
        FROM topics t
        LEFT JOIN questions q ON q.topic_id = t.id
        LEFT JOIN answer_counts ac ON ac.question_id = q.id
        WHERE t.book_id = ${bookId}
        GROUP BY t.id
        ORDER BY t.title_uk ASC
    `;

    return rows.map((topic) => ({
        id: topic.id,
        bookId: topic.book_id,
        titleUk: topic.title_uk,
        titleEn: topic.title_en,
        totalQuestions: topic.total_questions,
        activeQuestions: topic.active_questions,
        inactiveQuestions: topic.inactive_questions,
        previewQuestions: topic.preview_questions,
        questionsWithoutAnswers: topic.questions_without_answers,
        isProcessing: topic.is_processing,
        processingStartedAt: topic.processing_started_at
    }));
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
        },
        select: {
            id: true,
            bookId: true,
            titleUk: true,
            titleEn: true,
            isProcessing: true,
            processingStartedAt: true
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
