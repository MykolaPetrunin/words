'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw } from 'lucide-react';
import React, { useCallback, useMemo, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import FilterSelect from '@/components/filterSelect/FilterSelect';
import type { FilterSelectOption } from '@/components/filterSelect/types';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { QuestionFiltersTree, QuestionListItem } from '@/lib/repositories/questionRepository';

import { fetchAdminQuestions } from '../actions';

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

interface AdminFiltersProps {
    filters: QuestionFiltersTree;
    onFiltersChange: (values: FiltersFormValues, questions: QuestionListItem[]) => void;
    isPending: boolean;
}

export default function AdminFilters({ filters, onFiltersChange, isPending }: AdminFiltersProps): React.ReactElement {
    const t = useI18n();
    const [isTransitionPending, startTransition] = useTransition();

    const form = useForm<FiltersFormValues>({
        resolver: zodResolver(filtersSchema),
        defaultValues: defaultFilters
    });

    const watchedFilters = useWatch({ control: form.control });

    const subjectOptions = useMemo<FilterSelectOption[]>(() => filters.map((subject) => ({ value: subject.value, label: subject.label })), [filters]);

    const bookOptions = useMemo<FilterSelectOption[]>(() => {
        const subjectId = watchedFilters.subjectId;

        if (subjectId) {
            const subject = filters.find((item) => item.value === subjectId);
            if (subject) {
                return subject.books.map((book) => ({ value: book.value, label: book.label }));
            }
        }

        return filters
            .flatMap((subject) => subject.books)
            .filter((book, index, self) => index === self.findIndex((b) => b.value === book.value))
            .map((book) => ({ value: book.value, label: book.label }));
    }, [filters, watchedFilters.subjectId]);

    const topicOptions = useMemo<FilterSelectOption[]>(() => {
        const bookId = watchedFilters.bookId;
        if (!bookId) {
            return filters
                .flatMap((subject) => subject.books)
                .filter((book, index, self) => index === self.findIndex((b) => b.value === book.value))
                .flatMap((book) => book.topics)
                .filter((topic, index, self) => index === self.findIndex((b) => b.value === topic.value))
                .map((topic) => ({ value: topic.value, label: topic.label }));
        }

        const books = filters.flatMap((subject) => subject.books).filter((book, index, self) => index === self.findIndex((b) => b.value === book.value));

        const book = books.find((book) => book.value === bookId);

        if (book) {
            return book.topics.map((topic) => ({ value: topic.value, label: topic.label }));
        }

        return [];
    }, [filters, watchedFilters.bookId]);

    const handleSuccess = useCallback(
        (values: FiltersFormValues, items: QuestionListItem[]) => {
            onFiltersChange(values, items);
            form.reset(values);
        },
        [form, onFiltersChange]
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

    const hasAppliedFilters = Boolean(watchedFilters.subjectId || watchedFilters.bookId || watchedFilters.topicId);
    const isLoading = isPending || isTransitionPending;

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
                    <FormField
                        control={form.control}
                        name="subjectId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel>{t('questions.subjectFilter')}</FormLabel>
                                <FilterSelect
                                    placeholder={t('questions.subjectPlaceholder')}
                                    value={field.value}
                                    options={subjectOptions}
                                    disabled={isLoading || subjectOptions.length === 0}
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
                                    placeholder={t('questions.bookPlaceholder')}
                                    value={field.value}
                                    options={bookOptions}
                                    disabled={isLoading || bookOptions.length === 0}
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
                                    placeholder={t('questions.topicPlaceholder')}
                                    value={field.value}
                                    options={topicOptions}
                                    disabled={isLoading || topicOptions.length === 0}
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

            {hasAppliedFilters && (
                <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" disabled={isLoading} onClick={resetFilters}>
                        <RotateCcw className="h-4 w-4" />
                        {t('questions.resetFilters')}
                    </Button>
                </div>
            )}
        </div>
    );
}
