'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { getAdminBookPath } from '@/lib/appPaths';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import QuestionCard from '../../../../../../components/QuestionCard';
import { processBulkTopicQuestions } from '../../actions';
import TopicQuestionSuggestionsDialog from '../topicQuestionSuggestionsDialog/TopicQuestionSuggestionsDialog';

export interface TopicSummary {
    readonly id: string;
    readonly titleUk: string;
    readonly titleEn: string;
    readonly isProcessing: boolean;
    readonly processingStartedAt: Date | null;
}

interface BookSummary {
    readonly id: string;
    readonly titleUk: string;
    readonly titleEn: string;
    readonly descriptionUk: string;
    readonly descriptionEn: string;
}

interface TopicQuestionsPageClientProps {
    readonly book: BookSummary;
    readonly topic: TopicSummary;
    readonly questions: readonly QuestionListItem[];
    readonly otherTopics: readonly TopicSummary[];
}

const MAX_PROCESSING_TIME_MS = 2 * 60 * 60 * 1000;

export default function TopicQuestionsPageClient({ book, topic, questions, otherTopics }: TopicQuestionsPageClientProps): React.ReactElement {
    const t = useI18n();
    const router = useRouter();
    const reduxUser = useAppSelector((state) => state.currentUser.user);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';
    const [isProcessingLocally, setIsProcessingLocally] = useState(false);

    const existingQuestionsPayload = useMemo(
        () =>
            questions.map((question) => ({
                textUk: question.textUk,
                textEn: question.textEn
            })),
        [questions]
    );

    const otherTopicsPayload = useMemo(
        () =>
            otherTopics.map((item) => ({
                titleUk: item.titleUk,
                titleEn: item.titleEn
            })),
        [otherTopics]
    );

    const questionsWithoutAnswers = useMemo(() => questions.filter((q) => q.books.length === 0 || !q.theoryUk), [questions]);

    const sortedQuestions = useMemo(() => {
        return [...questions].sort((a, b) => {
            if (a.previewMode && !b.previewMode) return -1;
            if (!a.previewMode && b.previewMode) return 1;
            return 0;
        });
    }, [questions]);

    const isProcessing = topic.isProcessing || isProcessingLocally;

    const isProcessingStuck = useMemo(() => {
        if (!topic.isProcessing || !topic.processingStartedAt) return false;
        const elapsed = Date.now() - new Date(topic.processingStartedAt).getTime();
        return elapsed > MAX_PROCESSING_TIME_MS;
    }, [topic.isProcessing, topic.processingStartedAt]);

    useEffect(() => {
        if (!isProcessing) return;

        const interval = setInterval(() => {
            router.refresh();
        }, 10000);

        return () => clearInterval(interval);
    }, [isProcessing, router]);

    const handleSuggestionsApplied = useCallback(() => {
        router.refresh();
    }, [router]);

    const handleBulkGenerate = useCallback(async () => {
        setIsProcessingLocally(true);
        try {
            const result = await processBulkTopicQuestions(topic.id);
            if (result.success) {
                toast.success(t('admin.bulkGenerateSuccess'));
                router.refresh();
            } else {
                if (result.error === 'ALREADY_PROCESSING') {
                    toast.error(t('admin.bulkAlreadyProcessing'));
                } else {
                    toast.error(t('admin.bulkGenerateError'));
                }
            }
        } catch (error) {
            clientLogger.error('Bulk generation failed', error as Error, { topicId: topic.id });
            toast.error(t('admin.bulkGenerateError'));
        } finally {
            setIsProcessingLocally(false);
        }
    }, [topic.id, t, router]);

    const bookTitle = locale === 'en' ? book.titleEn : book.titleUk;
    const topicTitle = locale === 'en' ? topic.titleEn : topic.titleUk;
    const subtitle = t('admin.booksTopicQuestionsSubtitle').replace('{book}', bookTitle).replace('{topic}', topicTitle);

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">{t('admin.booksTopicQuestionsTitle')}</h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
                        <Button asChild variant="outline">
                            <Link href={getAdminBookPath(book.id)}>{t('common.back')}</Link>
                        </Button>
                        <TopicQuestionSuggestionsDialog
                            book={book}
                            topic={{
                                id: topic.id,
                                titleUk: topic.titleUk,
                                titleEn: topic.titleEn,
                                isProcessing: topic.isProcessing,
                                processingStartedAt: topic.processingStartedAt
                            }}
                            existingQuestions={existingQuestionsPayload}
                            otherTopics={otherTopicsPayload}
                            onApplied={handleSuggestionsApplied}
                        />
                        {questionsWithoutAnswers.length > 0 && !isProcessing && (
                            <Button onClick={handleBulkGenerate} variant="default">
                                {t('admin.bulkGenerateButton')}
                            </Button>
                        )}
                        {isProcessing && (
                            <div className="flex items-center gap-2 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{t('admin.bulkGenerating')}</span>
                            </div>
                        )}
                        {isProcessingStuck && (
                            <Button onClick={handleBulkGenerate} variant="destructive" size="sm">
                                {t('admin.bulkResetAndRestart')}
                            </Button>
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {questions.length} {t('questions.resultsSuffix')}
                    </div>
                </div>

                {questions.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center">
                        <p className="text-sm text-muted-foreground">{t('admin.booksTopicQuestionsEmpty')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedQuestions.map((question) => (
                            <QuestionCard key={question.id} question={question} locale={locale} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
