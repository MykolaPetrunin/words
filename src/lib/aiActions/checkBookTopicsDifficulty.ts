import OpenAI from 'openai';

import { serverLogger } from '../logger';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

interface TopicDifficulty {
    id: string;
    difficulty: number;
}

export const checkBookTopicsDifficulty = async (topics: Array<{ id: string; titleUk: string; titleEn: string }>): Promise<Array<TopicDifficulty> | null> => {
    try {
        const response = await client.responses.create({
            prompt: {
                id: process.env['PROMPT_ID_TOPICS_DIFFICULTY'] ?? '',
                ...(process.env['PROMPT_VERSION_TOPICS_DIFFICULTY'] ? { version: process.env['PROMPT_VERSION_TOPICS_DIFFICULTY'] } : {})
            },
            input: JSON.stringify({ topics })
        });

        if (!response.output_text) return null;

        const result = JSON.parse(response.output_text);

        const sourceIds = new Set<string>(topics.map((topic) => topic.id));
        const resultIds = new Set<string>(result.topics.map((topic: { id: string }) => topic.id));
        const mergedIds = new Set<string>([...sourceIds, ...resultIds]);

        if (!result.topics || !Array.isArray(result.topics) || sourceIds.size !== resultIds.size || mergedIds.size !== topics.length) return null;

        return result.topics as Array<TopicDifficulty>;
    } catch (error) {
        serverLogger.error('Book topics difficulty check failed', error as Error);
        return null;
    }
};
