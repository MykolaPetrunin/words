'use server';

import type { PublicAnswer } from './questionRepository';
import { getPublicAnswersByQuestionId } from './questionRepository';

export async function fetchQuestionAnswers(questionId: string): Promise<PublicAnswer[]> {
    return getPublicAnswersByQuestionId(questionId);
}
