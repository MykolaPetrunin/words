'use client';

import React, { useState } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionFiltersTree, QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import AdminFilters from './components/AdminFilters';
import QuestionCard from './components/QuestionCard';
import QuestionsSkeleton from './components/QuestionsSkeleton';

interface AdminPageClientProps {
    initialQuestions: QuestionListItem[];
    filters: QuestionFiltersTree;
}

export default function AdminPageClient({ initialQuestions, filters }: AdminPageClientProps): React.ReactElement {
    const t = useI18n();
    const reduxUser = useAppSelector((s) => s.currentUser.user);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';

    const [questions, setQuestions] = useState<QuestionListItem[]>(initialQuestions);
    const [isPending] = useState(false);

    const handleFiltersChange = (_values: unknown, items: QuestionListItem[]) => {
        setQuestions(items);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('questions.pageTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('questions.pageSubtitle')}</p>
            </div>

            <AdminFilters filters={filters} onFiltersChange={handleFiltersChange} isPending={isPending} />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{t('questions.resultsHeading')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {questions.length} {t('questions.resultsSuffix')}
                    </p>
                </div>
            </div>

            {isPending ? (
                <QuestionsSkeleton count={Math.max(questions.length, 3)} />
            ) : questions.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <p className="text-sm text-muted-foreground">{t('questions.emptyState')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question) => (
                        <QuestionCard key={question.id} question={question} locale={locale} t={t} />
                    ))}
                </div>
            )}
        </div>
    );
}
