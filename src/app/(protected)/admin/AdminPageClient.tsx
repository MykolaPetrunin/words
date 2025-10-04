'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw } from 'lucide-react';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import FilterSelect from '@/components/filterSelect/FilterSelect';
import type { FilterSelectOption } from '@/components/filterSelect/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/useI18n';
import type { I18nKey } from '@/lib/i18n/types';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionFilterBookOption, QuestionFiltersTree, QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import { fetchAdminQuestions } from './actions';

interface AdminPageClientProps {
    initialQuestions: QuestionListItem[];
    filters: QuestionFiltersTree;
}

const filtersSchema = z.object({
    subjectId: z.string().min(1).optional(),
    bookId: z.string().min(1).optional(),
    topicId: z.string().min(1).optional()
});

type FiltersFormValues = z.infer<typeof filtersSchema>;

const defaultFilters: FiltersFormValues = {
    subjectId: undefined,
    bookId: undefined,
    topicId: undefined
};

export default function AdminPageClient({ initialQuestions, filters }: AdminPageClientProps): React.ReactElement {
    const t = useI18n();
    const reduxUser = useAppSelector((s) => s.currentUser.user);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';

    const [appliedFilters, setAppliedFilters] = useState<FiltersFormValues>(defaultFilters);
    const [questions, setQuestions] = useState<QuestionListItem[]>(initialQuestions);
    const [isPending, startTransition] = useTransition();

    const form = useForm<FiltersFormValues>({
        resolver: zodResolver(filtersSchema),
        defaultValues: appliedFilters
    });

    const watchedFilters = useWatch({ control: form.control });

    const subjectOptions = useMemo<FilterSelectOption[]>(() => filters.map((subject) => ({ value: subject.value, label: subject.label })), [filters]);

    const bookOptions = useMemo<QuestionFilterBookOption[]>(() => {
        const subjectId = watchedFilters.subjectId;
        const map = new Map<string, QuestionFilterBookOption>();

        if (subjectId) {
            const subject = filters.find((item) => item.value === subjectId);
            if (subject) {
                subject.books.forEach((book) => {
                    map.set(book.value, {
                        value: book.value,
                        label: book.label,
                        topics: [...book.topics].sort((a, b) => a.label.localeCompare(b.label))
                    });
                });
            }
        } else {
            filters.forEach((subject) => {
                subject.books.forEach((book) => {
                    if (!map.has(book.value)) {
                        map.set(book.value, {
                            value: book.value,
                            label: book.label,
                            topics: [...book.topics].sort((a, b) => a.label.localeCompare(b.label))
                        });
                        return;
                    }

                    const existing = map.get(book.value);
                    if (!existing) {
                        return;
                    }

                    const mergedTopics = new Map(existing.topics.map((topic) => [topic.value, topic] as const));
                    book.topics.forEach((topic) => {
                        if (!mergedTopics.has(topic.value)) {
                            mergedTopics.set(topic.value, topic);
                        }
                    });
                    existing.topics = Array.from(mergedTopics.values()).sort((a, b) => a.label.localeCompare(b.label));
                    map.set(book.value, existing);
                });
            });
        }

        return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    }, [filters, watchedFilters.subjectId]);

    const topicOptions = useMemo<FilterSelectOption[]>(() => {
        const bookId = watchedFilters.bookId;
        if (!bookId) {
            return [];
        }
        const topics = new Map<string, FilterSelectOption>();
        filters.forEach((subject) => {
            subject.books.forEach((book) => {
                if (book.value !== bookId) {
                    return;
                }
                book.topics.forEach((topic) => {
                    if (!topics.has(topic.value)) {
                        topics.set(topic.value, { value: topic.value, label: topic.label });
                    }
                });
            });
        });
        return Array.from(topics.values()).sort((a, b) => a.label.localeCompare(b.label));
    }, [filters, watchedFilters.bookId]);

    const handleSuccess = useCallback(
        (values: FiltersFormValues, items: QuestionListItem[]) => {
            setQuestions(items);
            setAppliedFilters(values);
            form.reset(values);
        },
        [form]
    );

    const submitFilters = useCallback(
        async (values: FiltersFormValues) => {
            try {
                const payload = {
                    subjectIds: values.subjectId ? [values.subjectId] : undefined,
                    bookIds: values.bookId ? [values.bookId] : undefined,
                    topicIds: values.topicId ? [values.topicId] : undefined
                };
                const items = await fetchAdminQuestions(payload);
                handleSuccess(values, items);
            } catch (error) {
                clientLogger.error('Admin questions filters submission failed', error as Error, {
                    subjectId: values.subjectId,
                    bookId: values.bookId,
                    topicId: values.topicId
                });
                toast.error(t('questions.filtersError'));
            }
        },
        [handleSuccess, t]
    );

    const submitWithTransition = useCallback(
        (values: FiltersFormValues) => {
            startTransition(() => {
                void submitFilters(values);
            });
        },
        [startTransition, submitFilters]
    );

    const handleSubjectChange = useCallback(
        (value?: string) => {
            form.setValue('subjectId', value, { shouldDirty: true, shouldTouch: true });
            form.setValue('bookId', undefined, { shouldDirty: true, shouldTouch: true });
            form.setValue('topicId', undefined, { shouldDirty: true, shouldTouch: true });
            void form.handleSubmit(submitWithTransition)();
        },
        [form, submitWithTransition]
    );

    const handleBookChange = useCallback(
        (value?: string) => {
            form.setValue('bookId', value, { shouldDirty: true, shouldTouch: true });
            form.setValue('topicId', undefined, { shouldDirty: true, shouldTouch: true });
            void form.handleSubmit(submitWithTransition)();
        },
        [form, submitWithTransition]
    );

    const handleTopicChange = useCallback(
        (value?: string) => {
            form.setValue('topicId', value, { shouldDirty: true, shouldTouch: true });
            void form.handleSubmit(submitWithTransition)();
        },
        [form, submitWithTransition]
    );

    const resetFilters = useCallback(() => {
        form.reset(defaultFilters);
        startTransition(() => {
            void submitFilters(defaultFilters);
        });
    }, [form, startTransition, submitFilters]);

    const hasAppliedFilters = Boolean(appliedFilters.subjectId || appliedFilters.bookId || appliedFilters.topicId);

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('questions.pageTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('questions.pageSubtitle')}</p>
            </div>

            <Form {...form}>
                <form className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
                    <FormField
                        control={form.control}
                        name="subjectId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel>{t('questions.subjectFilter')}</FormLabel>
                                <FilterSelect
                                    label={t('questions.subjectFilter')}
                                    placeholder={t('questions.subjectPlaceholder')}
                                    value={field.value}
                                    options={subjectOptions}
                                    disabled={isPending || subjectOptions.length === 0}
                                    searchPlaceholder={t('questions.searchPlaceholder')}
                                    noResultsLabel={t('questions.noResults')}
                                    clearLabel={t('questions.clearSelection')}
                                    onSelect={(nextValue) => {
                                        field.onChange(nextValue);
                                        handleSubjectChange(nextValue);
                                    }}
                                    onClear={() => {
                                        field.onChange(undefined);
                                        handleSubjectChange(undefined);
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bookId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel>{t('questions.bookFilter')}</FormLabel>
                                <FilterSelect
                                    label={t('questions.bookFilter')}
                                    placeholder={t('questions.bookPlaceholder')}
                                    value={field.value}
                                    options={bookOptions}
                                    disabled={isPending || bookOptions.length === 0}
                                    searchPlaceholder={t('questions.searchPlaceholder')}
                                    noResultsLabel={t('questions.noResults')}
                                    clearLabel={t('questions.clearSelection')}
                                    onSelect={(nextValue) => {
                                        field.onChange(nextValue);
                                        handleBookChange(nextValue);
                                    }}
                                    onClear={() => {
                                        field.onChange(undefined);
                                        handleBookChange(undefined);
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="topicId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel>{t('questions.topicFilter')}</FormLabel>
                                <FilterSelect
                                    label={t('questions.topicFilter')}
                                    placeholder={t('questions.topicPlaceholder')}
                                    value={field.value}
                                    options={topicOptions}
                                    disabled={isPending || topicOptions.length === 0}
                                    searchPlaceholder={t('questions.searchPlaceholder')}
                                    noResultsLabel={t('questions.noResults')}
                                    clearLabel={t('questions.clearSelection')}
                                    onSelect={(nextValue) => {
                                        field.onChange(nextValue);
                                        handleTopicChange(nextValue);
                                    }}
                                    onClear={() => {
                                        field.onChange(undefined);
                                        handleTopicChange(undefined);
                                    }}
                                />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{t('questions.resultsHeading')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {questions.length} {t('questions.resultsSuffix')}
                    </p>
                </div>
                {hasAppliedFilters && (
                    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={resetFilters}>
                        <RotateCcw className="h-4 w-4" />
                        {t('questions.resetFilters')}
                    </Button>
                )}
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

interface QuestionCardProps {
    question: QuestionListItem;
    locale: UserLocale;
    t: (key: I18nKey) => string;
}

function QuestionCard({ question, locale, t }: QuestionCardProps): React.ReactElement {
    const questionText = locale === 'uk' ? question.textUk : question.textEn;
    const levelLabel = locale === 'uk' ? question.level.nameUk : question.level.nameEn;
    const topicLabel = question.topic ? (locale === 'uk' ? question.topic.titleUk : question.topic.titleEn) : null;

    return (
        <Card className="border">
            <CardHeader className="space-y-3">
                <CardTitle className="text-base font-semibold leading-relaxed">{questionText}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>
                        {t('questions.levelLabel')}: {levelLabel}
                    </span>
                    {topicLabel && (
                        <span>
                            {t('questions.topicLabel')}: {topicLabel}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm font-medium text-foreground">{t('questions.booksHeading')}</p>
                <div className="flex flex-wrap gap-3">
                    {question.books.map((book) => {
                        const bookTitle = locale === 'uk' ? book.titleUk : book.titleEn;
                        const subjectNames = book.subjects.map((subject) => (locale === 'uk' ? subject.nameUk : subject.nameEn));
                        return (
                            <div key={book.id} className="rounded-md border bg-muted/40 px-3 py-2">
                                <p className="text-sm font-medium leading-snug">{bookTitle}</p>
                                {subjectNames.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {t('questions.subjectsLabel')}: {subjectNames.join(', ')}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

function QuestionsSkeleton({ count }: { count: number }): React.ReactElement {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="border">
                    <CardHeader className="space-y-3">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-9 w-40" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
