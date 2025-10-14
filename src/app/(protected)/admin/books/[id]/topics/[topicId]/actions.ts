'use server';

import { revalidatePath } from 'next/cache';

import { appPaths, getAdminBookPath, getAdminBookTopicPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import type { LevelKey } from '@/lib/repositories/bookLevelProgress';

import type { TopicQuestionSuggestion } from './components/topicQuestionsPageClient/aiActions';

interface CreateTopicQuestionsInput {
    readonly bookId: string;
    readonly topicId: string;
    readonly suggestions: readonly TopicQuestionSuggestion[];
}

const levelKeys: readonly LevelKey[] = ['junior', 'middle', 'senior'];

export const createTopicQuestionsFromSuggestions = async ({ bookId, topicId, suggestions }: CreateTopicQuestionsInput): Promise<number> => {
    try {
        const normalized = suggestions
            .map((suggestion) => ({
                textUk: suggestion.textUk.trim(),
                textEn: suggestion.textEn.trim(),
                level: suggestion.level
            }))
            .filter((item) => item.textUk.length > 0 && item.textEn.length > 0);

        if (normalized.length === 0) {
            return 0;
        }

        const requestedLevels = Array.from(new Set(normalized.map((item) => item.level)));
        const levels = await prisma.level.findMany({
            where: {
                key: {
                    in: requestedLevels
                }
            },
            select: {
                id: true,
                key: true
            }
        });

        const levelMap = new Map<LevelKey, string>();
        for (const level of levels) {
            if (levelKeys.includes(level.key as LevelKey)) {
                levelMap.set(level.key as LevelKey, level.id);
            }
        }

        if (levelMap.size !== requestedLevels.length) {
            throw new Error('LEVEL_NOT_FOUND');
        }

        await prisma.$transaction(async (tx) => {
            for (const suggestion of normalized) {
                const levelId = levelMap.get(suggestion.level);
                if (!levelId) {
                    throw new Error('LEVEL_NOT_FOUND');
                }

                await tx.question.create({
                    data: {
                        textUk: suggestion.textUk,
                        textEn: suggestion.textEn,
                        theoryUk: '',
                        theoryEn: '',
                        bookId,
                        topicId,
                        levelId,
                        isActive: true
                    }
                });
            }
        });

        revalidatePath(getAdminBookTopicPath(bookId, topicId));
        revalidatePath(getAdminBookPath(bookId));
        revalidatePath(appPaths.adminBooks);
        revalidatePath(appPaths.adminQuestions);
        revalidatePath(appPaths.admin);

        return normalized.length;
    } catch (error) {
        serverLogger.error('Topic questions creation failed', error as Error, { bookId, topicId });
        throw error;
    }
};
