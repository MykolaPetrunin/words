import prisma from '@/lib/prisma';

export interface DbUserQuestionScore {
    id: string;
    userId: string;
    questionId: string;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpsertUserQuestionScoreInput {
    userId: string;
    questionId: string;
    isCorrectAnswer: boolean;
}

export async function upsertUserQuestionScore({ userId, questionId, isCorrectAnswer }: UpsertUserQuestionScoreInput): Promise<DbUserQuestionScore> {
    const existingScore = await prisma.userQuestionScore.findUnique({
        where: {
            userId_questionId: {
                userId,
                questionId
            }
        }
    });

    let newScore: number;

    if (isCorrectAnswer) {
        newScore = (existingScore?.score ?? 0) + 1;
    } else {
        const currentScore = existingScore?.score ?? 0;
        if (currentScore <= 5) {
            newScore = Math.floor(currentScore / 2);
        } else {
            newScore = 2;
        }
    }

    const upsertedScore = await prisma.userQuestionScore.upsert({
        where: {
            userId_questionId: {
                userId,
                questionId
            }
        },
        create: {
            userId,
            questionId,
            score: newScore
        },
        update: {
            score: newScore
        }
    });

    return {
        id: upsertedScore.id,
        userId: upsertedScore.userId,
        questionId: upsertedScore.questionId,
        score: upsertedScore.score,
        createdAt: upsertedScore.createdAt,
        updatedAt: upsertedScore.updatedAt
    };
}

export async function getUserQuestionScore(userId: string, questionId: string): Promise<DbUserQuestionScore | null> {
    const score = await prisma.userQuestionScore.findUnique({
        where: {
            userId_questionId: {
                userId,
                questionId
            }
        }
    });

    if (!score) return null;

    return {
        id: score.id,
        userId: score.userId,
        questionId: score.questionId,
        score: score.score,
        createdAt: score.createdAt,
        updatedAt: score.updatedAt
    };
}
