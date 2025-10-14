'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { getAdminBookPath } from '@/lib/appPaths';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import QuestionCard from '../../../../../../components/QuestionCard';
import TopicQuestionSuggestionsDialog from '../topicQuestionSuggestionsDialog/TopicQuestionSuggestionsDialog';

export interface TopicSummary {
    readonly id: string;
    readonly titleUk: string;
    readonly titleEn: string;
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

export default function TopicQuestionsPageClient({ book, topic, questions, otherTopics }: TopicQuestionsPageClientProps): React.ReactElement {
    const t = useI18n();
    const router = useRouter();
    const reduxUser = useAppSelector((state) => state.currentUser.user);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';

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

    const handleSuggestionsApplied = useCallback(() => {
        router.refresh();
    }, [router]);

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
                            topic={topic}
                            existingQuestions={existingQuestionsPayload}
                            otherTopics={otherTopicsPayload}
                            onApplied={handleSuggestionsApplied}
                        />
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
                        {questions.map((question) => (
                            <QuestionCard key={question.id} question={question} locale={locale} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
