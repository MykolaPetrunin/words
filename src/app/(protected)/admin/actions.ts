'use server';

import { getAllQuestions } from '@/lib/repositories/questionRepository';
import type { QuestionListFilters, QuestionListItem } from '@/lib/repositories/questionRepository';

export async function fetchAdminQuestions(filters: QuestionListFilters): Promise<QuestionListItem[]> {
    return getAllQuestions(filters);
}
