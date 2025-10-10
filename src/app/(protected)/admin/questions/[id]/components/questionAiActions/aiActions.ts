'use server';

import OpenAI from 'openai';

import { serverLogger } from '@/lib/logger';

import { QuestionFormData } from '../../schemas';

import { questionClarityPrompt, questionClarityResponseFormat, questionTheoryCheckPrompt, questionTheotyCheckResponseFormat } from './configs';

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
        const completion = await client.chat.completions.create({
            model: 'gpt-5-mini',
            response_format: questionClarityResponseFormat,
            messages: [
                {
                    role: 'system',
                    content: questionClarityPrompt
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        question: {
                            textUk: data.textUk,
                            textEn: data.textEn,
                            answers: data.answers.map((answer: QuestionFormData['answers'][number]) => ({
                                id: answer.id,
                                textUk: answer.textUk,
                                textEn: answer.textEn,
                                isCorrect: answer.isCorrect
                            }))
                        }
                    })
                }
            ]
        });

        if (!completion.choices[0].message.content) {
            return null;
        }

        const suggestion = JSON.parse(completion.choices[0].message.content);

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
        const completion = await client.chat.completions.create({
            model: 'gpt-5-mini',
            response_format: questionTheotyCheckResponseFormat,
            messages: [
                {
                    role: 'system',
                    content: questionTheoryCheckPrompt
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        question: {
                            textUk: data.textUk,
                            textEn: data.textEn,
                            theoryUk: data.theoryUk,
                            theoryEn: data.theoryEn,
                            answers: data.answers.map((answer: QuestionFormData['answers'][number]) => ({
                                id: answer.id,
                                textUk: answer.textUk,
                                textEn: answer.textEn,
                                theoryUk: answer.theoryUk,
                                theoryEn: answer.theoryEn,
                                isCorrect: answer.isCorrect
                            }))
                        }
                    })
                }
            ]
        });

        if (!completion.choices[0].message.content) {
            return null;
        }

        const suggestion = JSON.parse(completion.choices[0].message.content);

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
