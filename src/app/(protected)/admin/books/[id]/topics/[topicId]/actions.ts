'use server';

import { revalidatePath } from 'next/cache';

import { getQusetionAnswersSuggestions } from '@/app/(protected)/admin/questions/[id]/components/questionAnswersDialog/aiActions';
import { getQuestionTheorySuggestions } from '@/app/(protected)/admin/questions/[id]/components/questionTheoryDialog/aiActions';
import { appPaths, getAdminBookPath, getAdminBookTopicPath } from '@/lib/appPaths';
import { serverLogger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import type { LevelKey } from '@/lib/repositories/bookLevelProgress';
import { bulkCreateAnswersForQuestion, bulkUpdateAnswersTheory, setQuestionPreviewMode, updateQuestionTheory } from '@/lib/repositories/questionRepository';
import { getTopicWithProcessingStatus, setTopicProcessing } from '@/lib/repositories/topicRepository';

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
                        isActive: false
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

const MAX_PROCESSING_TIME_MS = 2 * 60 * 60 * 1000;

export const processBulkTopicQuestions = async (topicId: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const topic = await getTopicWithProcessingStatus(topicId);

        if (!topic) {
            return { success: false, error: 'TOPIC_NOT_FOUND' };
        }

        if (topic.isProcessing && topic.processingStartedAt) {
            const elapsedTime = Date.now() - topic.processingStartedAt.getTime();
            if (elapsedTime < MAX_PROCESSING_TIME_MS) {
                return { success: false, error: 'ALREADY_PROCESSING' };
            }
        }

        await setTopicProcessing(topicId, true);

        const book = await prisma.book.findUnique({
            where: { id: topic.bookId },
            select: {
                id: true,
                titleUk: true,
                titleEn: true,
                descriptionUk: true,
                descriptionEn: true
            }
        });

        if (!book) {
            await setTopicProcessing(topicId, false);
            return { success: false, error: 'BOOK_NOT_FOUND' };
        }

        const questions = await prisma.question.findMany({
            where: {
                topicId,
                answers: {
                    none: {}
                }
            },
            include: {
                answers: true
            }
        });

        for (const question of questions) {
            try {
                const answersSuggestions = await getQusetionAnswersSuggestions({
                    book: {
                        titleUk: book.titleUk,
                        titleEn: book.titleEn,
                        descriptionUk: book.descriptionUk ?? '',
                        descriptionEn: book.descriptionEn ?? ''
                    },
                    topic: {
                        titleUk: topic.titleUk,
                        titleEn: topic.titleEn
                    },
                    question: {
                        textUk: question.textUk,
                        textEn: question.textEn
                    }
                });

                if (!answersSuggestions || answersSuggestions.length === 0) {
                    continue;
                }

                await bulkCreateAnswersForQuestion(
                    question.id,
                    answersSuggestions.map((ans: { textUk: string; textEn: string; isCorrect: boolean }) => ({
                        textUk: ans.textUk,
                        textEn: ans.textEn,
                        isCorrect: ans.isCorrect
                    }))
                );

                await setQuestionPreviewMode(question.id, true);

                const updatedQuestion = await prisma.question.findUnique({
                    where: { id: question.id },
                    include: {
                        answers: {
                            orderBy: { orderIndex: 'asc' }
                        }
                    }
                });

                if (!updatedQuestion) {
                    continue;
                }

                const theorySuggestions = await getQuestionTheorySuggestions({
                    book: {
                        titleUk: book.titleUk,
                        titleEn: book.titleEn,
                        descriptionUk: book.descriptionUk ?? '',
                        descriptionEn: book.descriptionEn ?? ''
                    },
                    topic: {
                        titleUk: topic.titleUk,
                        titleEn: topic.titleEn
                    },
                    question: {
                        textUk: updatedQuestion.textUk,
                        textEn: updatedQuestion.textEn,
                        answers: updatedQuestion.answers.map((ans) => ({
                            id: ans.id,
                            textUk: ans.textUk,
                            textEn: ans.textEn,
                            isCorrect: ans.isCorrect
                        }))
                    }
                });

                if (theorySuggestions && theorySuggestions.theoryUk && theorySuggestions.theoryEn) {
                    await updateQuestionTheory(question.id, theorySuggestions.theoryUk, theorySuggestions.theoryEn);

                    if (theorySuggestions.answers && theorySuggestions.answers.length === updatedQuestion.answers.length) {
                        await bulkUpdateAnswersTheory(
                            updatedQuestion.answers.map((ans, idx) => ({
                                id: ans.id,
                                theoryUk: theorySuggestions.answers[idx].theoryUk,
                                theoryEn: theorySuggestions.answers[idx].theoryEn
                            }))
                        );
                    }
                }
            } catch (error) {
                serverLogger.error('Question processing failed', error as Error, { questionId: question.id, topicId });
            }
        }

        await setTopicProcessing(topicId, false);

        revalidatePath(getAdminBookTopicPath(book.id, topicId));
        revalidatePath(getAdminBookPath(book.id));
        revalidatePath(appPaths.adminBooks);
        revalidatePath(appPaths.adminQuestions);

        return { success: true };
    } catch (error) {
        serverLogger.error('Bulk topic processing failed', error as Error, { topicId });
        await setTopicProcessing(topicId, false).catch(() => {});
        return { success: false, error: 'PROCESSING_FAILED' };
    }
};
