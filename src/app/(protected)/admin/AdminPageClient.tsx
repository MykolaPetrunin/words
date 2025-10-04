'use client';

import React, { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionFiltersTree, QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import { fetchAdminQuestions } from './actions';
import AdminFilters from './components/AdminFilters';
import QuestionCard from './components/QuestionCard';
import QuestionsSkeleton from './components/QuestionsSkeleton';

type FiltersFormValues = {
    subjectId?: string;
    bookId?: string;
    topicId?: string;
};

const defaultFilters: FiltersFormValues = {
    subjectId: undefined,
    bookId: undefined,
    topicId: undefined
};

interface AdminPageClientProps {
    initialQuestions: QuestionListItem[];
    filters: QuestionFiltersTree;
}

export default function AdminPageClient({ initialQuestions, filters }: AdminPageClientProps): React.ReactElement {
    const t = useI18n();
    const reduxUser = useAppSelector((s) => s.currentUser.user);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';
    const [isTransitionPending, startTransition] = useTransition();

    const [questions, setQuestions] = useState<QuestionListItem[]>(initialQuestions);
    const [filtersValue, setFiltersValue] = useState<FiltersFormValues>(defaultFilters);
    const [isPending, setIsPending] = useState(false);

    const handleFiltersChange = useCallback(
        async (values: FiltersFormValues) => {
            setIsPending(true);
            try {
                const payload = {
                    subjectIds: values.subjectId ? [values.subjectId] : undefined,
                    bookIds: values.bookId ? [values.bookId] : undefined,
                    topicIds: values.topicId ? [values.topicId] : undefined
                };
                const items = await fetchAdminQuestions(payload);
                setQuestions(items);
                setFiltersValue(values);
            } catch (error) {
                clientLogger.error('Admin questions filters submission failed', error as Error, {
                    subjectId: values.subjectId,
                    bookId: values.bookId,
                    topicId: values.topicId
                });
                toast.error(t('questions.filtersError'));
            } finally {
                setIsPending(false);
            }
        },
        [t]
    );

    const handleFiltersChangeWithTransition = useCallback(
        (values: FiltersFormValues) => {
            startTransition(() => {
                void handleFiltersChange(values);
            });
        },
        [startTransition, handleFiltersChange]
    );

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('questions.pageTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('questions.pageSubtitle')}</p>
            </div>

            <AdminFilters filters={filters} value={filtersValue} onChange={handleFiltersChangeWithTransition} isPending={isPending || isTransitionPending} />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{t('questions.resultsHeading')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {questions.length} {t('questions.resultsSuffix')}
                    </p>
                </div>
            </div>

            {isPending || isTransitionPending ? (
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
