'use server';

import { revalidatePath } from 'next/cache';

import { getQusetionAnswersSuggestions, type QuestionAnswersSuggestion } from '@/lib/aiActions/getQusetionAnswersSuggestions';
import { appPaths, getAdminQuestionPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { getQuestionDetailById, updateQuestionDetail, type QuestionDetail, type UpdateQuestionInput } from '@/lib/repositories/questionRepository';

interface SuggestionFailParams {
    code: QuestionAnswersSuggestionErrorCode;
    message: string;
    error?: Error;
}

interface QuestionAnswersSuggestionSuccess {
    success: true;
    data: {
        answers: readonly QuestionAnswersSuggestion[];
    };
}

interface QuestionAnswersSuggestionFailure {
    success: false;
    code: QuestionAnswersSuggestionErrorCode;
    message: string;
}

export type QuestionAnswersSuggestionErrorCode =
    | 'openai_api_key_missing'
    | 'prompt_missing'
    | 'question_not_found'
    | 'already_has_answers'
    | 'request_failed'
    | 'empty_response';

export type QuestionAnswersSuggestionResult = QuestionAnswersSuggestionSuccess | QuestionAnswersSuggestionFailure;

export async function generateAdminQuestionAnswers(questionId: string): Promise<QuestionAnswersSuggestionResult> {
    const fail = ({ code, message, error }: SuggestionFailParams): QuestionAnswersSuggestionFailure => {
        if (error) {
            serverLogger.error('Question answer suggestions failed', error, { questionId, code });
        } else {
            serverLogger.error('Question answer suggestions failed', undefined, { questionId, code });
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

    const promptId = process.env.PROMPT_ID_QUESTION_ANSWERS;
    if (!promptId || promptId.trim().length === 0) {
        return fail({ code: 'prompt_missing', message: 'Prompt identifier is not configured.' });
    }

    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            answers: true,
            topic: true,
            book: true
        }
    });

    if (!question) {
        return fail({ code: 'question_not_found', message: 'Question not found.' });
    }

    if (question.answers.length > 0) {
        return fail({ code: 'already_has_answers', message: 'Question already has answers.' });
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
                textEn: question.textEn
            }
        };
        const suggestions = await getQusetionAnswersSuggestions(payload);
        if (!suggestions || suggestions.length === 0) {
            return fail({ code: 'empty_response', message: 'OpenAI returned an empty response.' });
        }
        return {
            success: true,
            data: {
                answers: suggestions
            }
        };
    } catch (error) {
        return fail({ code: 'request_failed', message: 'Failed to generate answers.', error: error as Error });
    }
}

export async function applyAdminQuestionAnswers(questionId: string, answers: readonly QuestionAnswersSuggestion[]): Promise<QuestionDetail> {
    if (answers.length === 0) {
        throw new Error('No answers provided');
    }

    const question = await getQuestionDetailById(questionId);
    if (!question) {
        throw new Error('Question not found');
    }

    if (question.answers.length > 0) {
        throw new Error('Question already has answers');
    }

    const input: UpdateQuestionInput = {
        textUk: question.textUk,
        textEn: question.textEn,
        theoryUk: question.theoryUk ?? '',
        theoryEn: question.theoryEn ?? '',
        isActive: question.isActive,
        topicId: question.topicId ?? null,
        answers: answers.map((answer) => ({
            textUk: answer.textUk,
            textEn: answer.textEn,
            theoryUk: '',
            theoryEn: '',
            isCorrect: answer.isCorrect
        }))
    };

    try {
        const updated = await updateQuestionDetail(questionId, input);
        revalidatePath(appPaths.admin);
        revalidatePath(getAdminQuestionPath(questionId));
        return updated;
    } catch (error) {
        serverLogger.error('Question answer suggestions apply failed', error as Error, { questionId });
        throw error;
    }
}
