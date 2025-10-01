import prisma from '@/lib/prisma';

export type PublicAnswer = Pick<DbAnswer, 'id' | 'textUk' | 'textEn' | 'orderIndex' | 'theoryUk' | 'theoryEn' | 'isCorrect'>;

export interface DbAnswer {
    id: string;
    textUk: string;
    textEn: string;
    isCorrect: boolean;
    orderIndex: number;
    theoryUk: string | null;
    theoryEn: string | null;
}

export async function getAnswersByQuestionId(questionId: string): Promise<DbAnswer[]> {
    const answers = await prisma.answer.findMany({
        where: { questionId },
        orderBy: { orderIndex: 'asc' }
    });

    return answers.map((a) => ({
        id: a.id,
        textUk: a.textUk,
        textEn: a.textEn,
        isCorrect: a.isCorrect,
        orderIndex: a.orderIndex,
        theoryUk: a.theoryUk,
        theoryEn: a.theoryEn
    }));
}

export async function getPublicAnswersByQuestionId(questionId: string): Promise<PublicAnswer[]> {
    const answers = await getAnswersByQuestionId(questionId);
    return answers.map(({ id, textUk, textEn, orderIndex, theoryUk, theoryEn, isCorrect }) => ({ id, textUk, textEn, orderIndex, theoryUk, theoryEn, isCorrect }));
}
