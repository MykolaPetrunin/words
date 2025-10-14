'use server';

import OpenAI from 'openai';

import { serverLogger } from '@/lib/logger';

interface TopicQuestionsSuggestionsProps {
    readonly topicTitleEn: string;
    readonly topicTitleUk: string;
    readonly bookTitleEn: string;
    readonly bookTitleUk: string;
    readonly bookDescriptionEn: string;
    readonly bookDescriptionUk: string;
    readonly existingQuestions: {
        readonly textEn: string;
        readonly textUk: string;
    }[];
}

export interface TopicQuestionSuggestion {
    readonly textUk: string;
    readonly textEn: string;
    readonly theoryUk: string;
    readonly theoryEn: string;
    readonly level: 'junior' | 'middle' | 'senior';
}

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

export const getTopicQuestionsSuggestions = async (data: TopicQuestionsSuggestionsProps): Promise<TopicQuestionSuggestion[] | null> => {
    try {
        const response = await client.responses.create({
            prompt: {
                id: 'pmpt_68ec05820c4c8197b48c064f0fdef017058baa2a4d4c6bfa'
            },
            input: JSON.stringify(data)
        });

        if (!response.output_text) {
            return null;
        }

        const suggestion = JSON.parse(response.output_text);

        if (!suggestion.newQuestions || !Array.isArray(suggestion.newQuestions) || suggestion.newQuestions.length === 0) return null;

        const result = (
            suggestion.newQuestions as {
                textUk?: string;
                textEn?: string;
                theoryUk?: string;
                theoryEn?: string;
                level?: 'junior' | 'middle' | 'senior';
            }[]
        ).reduce<TopicQuestionSuggestion[]>((acc, question) => {
            if (question.textUk && question.textEn && question.theoryUk && question.theoryEn && question.level) {
                acc.push({
                    textUk: question.textUk,
                    textEn: question.textEn,
                    theoryUk: question.theoryUk,
                    theoryEn: question.theoryEn,
                    level: question.level
                });
            }
            return acc;
        }, []);

        if (result.length === 0) {
            return null;
        }

        return result;
    } catch (error) {
        serverLogger.error('Topic questions suggestions failed', error as Error);
        return null;
    }
};
