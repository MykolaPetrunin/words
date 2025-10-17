'use server';

import { revalidatePath } from 'next/cache';

import { getQuestionTheorySuggestions, QuestionTheorySuggestion } from '@/lib/aiActions/getQuestionTheorySuggestions';
import { appPaths, getAdminQuestionPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { getQuestionDetailById, updateQuestionDetail, type QuestionDetail, type UpdateQuestionInput } from '@/lib/repositories/questionRepository';

interface SuggestionFailParams {
    readonly code: QuestionTheorySuggestionErrorCode;
    readonly message: string;
    readonly error?: Error;
}

interface QuestionTheorySuggestionSuccess {
    readonly success: true;
    readonly data: {
        readonly suggestion: QuestionTheorySuggestion;
    };
}

interface QuestionTheorySuggestionFailure {
    readonly success: false;
    readonly code: QuestionTheorySuggestionErrorCode;
    readonly message: string;
}

export type QuestionTheorySuggestionErrorCode =
    | 'openai_api_key_missing'
    | 'prompt_missing'
    | 'question_not_found'
    | 'answers_missing'
    | 'answers_mismatch'
    | 'request_failed'
    | 'empty_response';

export type QuestionTheorySuggestionResult = QuestionTheorySuggestionSuccess | QuestionTheorySuggestionFailure;

export async function generateAdminQuestionTheory(questionId: string): Promise<QuestionTheorySuggestionResult> {
    const fail = ({ code, message, error }: SuggestionFailParams): QuestionTheorySuggestionFailure => {
        if (error) {
            serverLogger.error('Question theory suggestions failed', error, { questionId, code });
        } else {
            serverLogger.error('Question theory suggestions failed', undefined, { questionId, code });
        }
        return {
            success: false,
            code,
            message
        };
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return fail({ code: 'openai_api_key_missing', message: 'OpenAI API key is not configured.' });
    }

    const promptId = process.env.PROMPT_ID_QUESTION_THEORY;
    if (!promptId || promptId.trim().length === 0) {
        return fail({ code: 'prompt_missing', message: 'Prompt identifier is not configured.' });
    }

    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            answers: {
                orderBy: {
                    orderIndex: 'asc'
                }
            },
            topic: true,
            book: true
        }
    });

    if (!question) {
        return fail({ code: 'question_not_found', message: 'Question not found.' });
    }

    if (question.answers.length === 0) {
        return fail({ code: 'answers_missing', message: 'Question must have answers.' });
    }

    try {
        const payload = {
            book: {
                titleUk: question.book?.titleUk ?? '',
                titleEn: question.book?.titleEn ?? '',
                descriptionUk: question.book?.descriptionUk ?? '',
                descriptionEn: question.book?.descriptionEn ?? ''
            },
            topic: {
                titleUk: question.topic?.titleUk ?? '',
                titleEn: question.topic?.titleEn ?? ''
            },
            question: {
                textUk: question.textUk,
                textEn: question.textEn,
                answers: question.answers.map((answer) => ({
                    id: answer.id,
                    textUk: answer.textUk,
                    textEn: answer.textEn,
                    isCorrect: answer.isCorrect
                }))
            }
        };

        const suggestion = await getQuestionTheorySuggestions(payload);

        if (!suggestion) {
            return fail({ code: 'empty_response', message: 'OpenAI returned an empty response.' });
        }

        if (suggestion.answers.length !== question.answers.length) {
            return fail({ code: 'answers_mismatch', message: 'Invalid suggestion payload.' });
        }

        return {
            success: true,
            data: {
                suggestion
            }
        };
    } catch (error) {
        return fail({ code: 'request_failed', message: 'Failed to generate theory.', error: error as Error });
    }
}

export async function applyAdminQuestionTheory(questionId: string, suggestion: QuestionTheorySuggestion): Promise<QuestionDetail> {
    const question = await getQuestionDetailById(questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    if (question.answers.length === 0) {
        throw new Error('Question has no answers');
    }

    if (question.answers.length !== suggestion.answers.length) {
        throw new Error('Suggestion answers mismatch');
    }

    const input: UpdateQuestionInput = {
        textUk: question.textUk,
        textEn: question.textEn,
        theoryUk: suggestion.theoryUk,
        theoryEn: suggestion.theoryEn,
        isActive: question.isActive,
        topicId: question.topicId ?? null,
        answers: question.answers.map((answer, index) => ({
            id: answer.id,
            textUk: answer.textUk,
            textEn: answer.textEn,
            theoryUk: suggestion.answers[index]?.theoryUk ?? '',
            theoryEn: suggestion.answers[index]?.theoryEn ?? '',
            isCorrect: answer.isCorrect
        }))
    };

    try {
        const updated = await updateQuestionDetail(questionId, input);
        revalidatePath(appPaths.admin);
        revalidatePath(getAdminQuestionPath(questionId));
        return updated;
    } catch (error) {
        serverLogger.error('Question theory suggestions apply failed', error as Error, { questionId });
        throw error;
    }
}
