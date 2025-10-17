import OpenAI from 'openai';

import { serverLogger } from '@/lib/logger';
import { DbBookWithRelations } from '@/lib/repositories/bookRepository';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

interface PossibleTopicSuggestion {
    titleUk: string;
    titleEn: string;
    reason: string;
    isOptional: boolean;
}

export async function getBookTopicsSuggestions(data: DbBookWithRelations): Promise<PossibleTopicSuggestion[] | null> {
    try {
        const response = await client.responses.create({
            prompt: {
                id: process.env['PROMPT_ID_BOOK_TOPICS'] ?? '',
                ...(process.env['PROMPT_VERSION_BOOK_TOPICS'] ? { version: process.env['PROMPT_VERSION_BOOK_TOPICS'] } : {})
            },
            input: JSON.stringify(data)
        });

        if (!response.output_text) {
            return null;
        }

        const suggestion = JSON.parse(response.output_text);

        if (!suggestion.newTopics || !Array.isArray(suggestion.newTopics) || suggestion.newTopics.length === 0) {
            return null;
        }

        const result = (suggestion.newTopics as { titleUk?: string; titleEn?: string; reason?: string; isOptional?: boolean }[]).reduce<PossibleTopicSuggestion[]>(
            (acc, topic) => {
                if (topic.titleUk && topic.titleEn && topic.reason && Object.hasOwn(topic, 'isOptional')) {
                    acc.push(topic as PossibleTopicSuggestion);
                }
                return acc;
            },
            []
        );

        if (result.length === 0) {
            return null;
        }

        return result;
    } catch (error) {
        serverLogger.error('Book topics suggestions review failed', error as Error);
        return null;
    }
}
