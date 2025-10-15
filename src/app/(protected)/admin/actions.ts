'use server';

import { revalidatePath } from 'next/cache';

import { appPaths, getAdminQuestionPath } from '@/lib/appPaths';
import { getAllQuestions, updateQuestionDetail } from '@/lib/repositories/questionRepository';
import type { QuestionDetail, QuestionListFilters, QuestionListItem, UpdateQuestionInput } from '@/lib/repositories/questionRepository';

import { questionFormSchema, type QuestionFormData } from './questions/[id]/schemas';

const trimOrNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

export async function fetchAdminQuestions(filters: QuestionListFilters): Promise<QuestionListItem[]> {
    return getAllQuestions(filters);
}

export async function updateAdminQuestion(questionId: string, data: QuestionFormData): Promise<QuestionDetail> {
    const parsed = questionFormSchema.parse(data);

    const trimmedTheoryUk = trimOrNull(parsed.theoryUk);
    const trimmedTheoryEn = trimOrNull(parsed.theoryEn);
    const trimmedAnswers = parsed.answers.map((answer) => ({
        id: answer.id,
        textUk: answer.textUk,
        textEn: answer.textEn,
        theoryUk: trimOrNull(answer.theoryUk),
        theoryEn: trimOrNull(answer.theoryEn),
        isCorrect: answer.isCorrect
    }));

    if (parsed.isActive) {
        const missingQuestionTheory = !trimmedTheoryUk || !trimmedTheoryEn;
        const missingAnswersTheory = trimmedAnswers.some((answer) => !answer.theoryUk || !answer.theoryEn);
        if (missingQuestionTheory || missingAnswersTheory) {
            throw new Error('QUESTION_THEORY_REQUIRED');
        }
    }

    const payload: UpdateQuestionInput = {
        textUk: parsed.textUk,
        textEn: parsed.textEn,
        theoryUk: trimmedTheoryUk,
        theoryEn: trimmedTheoryEn,
        isActive: parsed.isActive,
        topicId: parsed.topicId ?? null,
        answers: trimmedAnswers
    } satisfies UpdateQuestionInput;

    const updated = await updateQuestionDetail(questionId, payload);
    revalidatePath(appPaths.admin);
    revalidatePath(getAdminQuestionPath(questionId));

    return updated;
}
