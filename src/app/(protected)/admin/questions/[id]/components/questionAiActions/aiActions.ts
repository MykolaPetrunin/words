'use server';

import OpenAI from 'openai';

import { serverLogger } from '@/lib/logger';

import { QuestionFormData } from '../../schemas';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

interface PossibleAnswerTextChange {
    id: string;
    improvedTextUK: string;
    improvedTextEN: string;
    isCorrect: boolean;
}

interface PossibleQuestionTextChanges {
    question?: {
        improvedTextUK: string;
        improvedTextEN: string;
    };
    answers?: PossibleAnswerTextChange[];
}

interface PossibleAnswerTheoryChange {
    id: string;
    improvedTheoryUK: string;
    improvedTheoryEN: string;
    isCorrect: boolean;
}
interface PossibleQuestionTheoryChanges {
    question?: {
        improvedTheoryUK: string;
        improvedTheoryEN: string;
    };
    answers?: PossibleAnswerTheoryChange[];
}
export async function reviewQuestionClarity(data: QuestionFormData): Promise<PossibleQuestionTextChanges | null> {
    try {
        const response = await client.responses.create({
            prompt: {
                id: 'pmpt_68e8f8dac280819787521e56c03187a10d27a8d5e2372e7e'
            },
            input: JSON.stringify(data)
        });

        if (!response.output_text) {
            return null;
        }

        const suggestion = JSON.parse(response.output_text);

        const result: PossibleQuestionTextChanges = {};

        if (suggestion.question?.needImprovements) {
            result.question = {
                improvedTextUK: suggestion.question.improvedTextUK,
                improvedTextEN: suggestion.question.improvedTextEN
            };
        }

        if (suggestion.answers && Array.isArray(suggestion.answers)) {
            const answers = (
                suggestion.answers as { needImprovements?: boolean; improvedTextUK?: string; improvedTextEN?: string; id?: string; isCorrect?: boolean }[]
            ).reduce<PossibleAnswerTextChange[]>((acc, answer) => {
                if (!!answer.needImprovements && answer.id && answer.improvedTextUK && answer.improvedTextEN && Object.hasOwn(answer, 'isCorrect')) {
                    acc.push({
                        id: answer.id,
                        improvedTextUK: answer.improvedTextUK,
                        improvedTextEN: answer.improvedTextEN,
                        isCorrect: !!answer.isCorrect
                    });
                }
                return acc;
            }, []);

            if (answers.length > 0) {
                result.answers = answers;
            }
        }

        if (Object.keys(result).length === 0) {
            return null;
        }

        return result;
    } catch (error) {
        serverLogger.error('Question clarity review failed', error as Error);
        return null;
    }
}

export async function reviewQuestionTheory(data: QuestionFormData): Promise<PossibleQuestionTheoryChanges | null> {
    try {
        const response = await client.responses.create({
            prompt: {
                id: 'pmpt_68ec022d109081908b80310657eb4d990c61dbc472de724e'
            },
            input: JSON.stringify(data)
        });

        if (!response.output_text) {
            return null;
        }

        const suggestion = JSON.parse(response.output_text);

        const result: PossibleQuestionTheoryChanges = {};

        if (suggestion.question?.needImprovements) {
            result.question = {
                improvedTheoryUK: suggestion.question.improvedTheoryUK,
                improvedTheoryEN: suggestion.question.improvedTheoryEN
            };
        }

        if (suggestion.answers && Array.isArray(suggestion.answers)) {
            const answers = (
                suggestion.answers as { needImprovements?: boolean; improvedTheoryUK?: string; improvedTheoryEN?: string; id?: string; isCorrect?: boolean }[]
            ).reduce<PossibleAnswerTheoryChange[]>((acc, answer) => {
                if (!!answer.needImprovements && answer.id && answer.improvedTheoryUK && answer.improvedTheoryEN && Object.hasOwn(answer, 'isCorrect')) {
                    acc.push({
                        id: answer.id,
                        improvedTheoryUK: answer.improvedTheoryUK,
                        improvedTheoryEN: answer.improvedTheoryEN,
                        isCorrect: !!answer.isCorrect
                    });
                }
                return acc;
            }, []);

            if (answers.length > 0) {
                result.answers = answers;
            }
        }

        if (Object.keys(result).length === 0) {
            return null;
        }

        return result;
    } catch (error) {
        serverLogger.error('Question theory review failed', error as Error);
        return null;
    }
}
