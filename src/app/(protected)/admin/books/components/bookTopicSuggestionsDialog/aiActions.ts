import OpenAI from 'openai';

import { serverLogger } from '../../../../../../lib/logger';
import { DbBookWithRelations } from '../../../../../../lib/repositories/bookRepository';

import { topicSuggestionPrompt, topicSuggestionResponseFormat } from './configs';

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
        const completion = await client.chat.completions.create({
            model: 'gpt-5-mini',
            response_format: topicSuggestionResponseFormat,
            messages: [
                {
                    role: 'system',
                    content: topicSuggestionPrompt
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        titleUk: data.titleUk,
                        titleEn: data.titleEn,
                        descriptionUk: data.descriptionUk,
                        descriptionEn: data.descriptionEn,
                        existingTopics: data.topics.map((topic) => ({
                            titleUk: topic.titleUk,
                            titleEn: topic.titleEn
                        }))
                    })
                }
            ]
        });

        if (!completion.choices[0].message.content) {
            return null;
        }

        const suggestion = JSON.parse(completion.choices[0].message.content);

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
