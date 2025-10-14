import { OpenAI } from 'openai';

import { serverLogger } from '@/lib/logger';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

interface QuestionTheorySuggestionsProps {
    book: {
        readonly titleUk: string;
        readonly titleEn: string;
        readonly descriptionUk: string;
        readonly descriptionEn: string;
    };
    topic: {
        readonly titleUk: string;
        readonly titleEn: string;
    };
    readonly question: {
        readonly textUk: string;
        readonly textEn: string;
        readonly answers: {
            readonly textUk: string;
            readonly textEn: string;
            readonly isCorrect: boolean;
        }[];
    };
}

interface QuestionTheorySuggestion {
    readonly theoryUk: string;
    readonly theoryEn: string;
    answers: {
        readonly theoryUk: string;
        readonly theoryEn: string;
    }[];
}

export const getQuestionTheorySuggestions = async (data: QuestionTheorySuggestionsProps): Promise<QuestionTheorySuggestion | null> => {
    try {
        const response = await client.responses.create({
            prompt: {
                id: process.env['PROMPT_ID_QUESTION_THEORY'] ?? ''
            },
            input: JSON.stringify(data)
        });

        if (!response.output_text) return null;

        const suggestion = JSON.parse(response.output_text);

        if (
            !suggestion.theoryUk ||
            !suggestion.theoryEn ||
            !suggestion.answers ||
            !Array.isArray(suggestion.answers) ||
            suggestion.answers.length !== data.question.answers.length
        ) {
            serverLogger.error('Question theory suggestions failed', new Error('Invalid suggestion length'));
            return null;
        }

        const answers = (suggestion.answers as { theoryUk: string; theoryEn: string }[]).reduce<{ theoryUk: string; theoryEn: string }[]>((acc, answer) => {
            if (!answer || !answer.theoryUk || !answer.theoryEn) return acc;
            return [...acc, { theoryUk: answer.theoryUk, theoryEn: answer.theoryEn }];
        }, []);

        if (answers.length !== data.question.answers.length) {
            serverLogger.error('Question theory suggestions failed', new Error('Invalid suggestion length'));
            return null;
        }

        return {
            theoryUk: suggestion.theoryUk,
            theoryEn: suggestion.theoryEn,
            answers
        };
    } catch (error) {
        serverLogger.error('Question theory suggestions failed', error as Error);
        return null;
    }
};
