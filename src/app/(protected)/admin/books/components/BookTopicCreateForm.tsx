'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbTopicWithStats } from '@/lib/repositories/topicRepository';

import { createAdminBookTopic } from '../actions';
import { createBookTopicFormSchema, type BookTopicFormData } from '../schemas';

interface BookTopicCreateFormProps {
    bookId: string;
    onTopicCreated: (topic: DbTopicWithStats) => void;
}

export default function BookTopicCreateForm({ bookId, onTopicCreated }: BookTopicCreateFormProps): React.ReactElement {
    const t = useI18n();
    const schema = useMemo(
        () =>
            createBookTopicFormSchema({
                titleUk: t('admin.booksTopicsCreateTitleUkRequired'),
                titleEn: t('admin.booksTopicsCreateTitleEnRequired')
            }),
        [t]
    );
    const defaultValues = useMemo<BookTopicFormData>(() => ({ titleUk: '', titleEn: '' }), []);
    const form = useForm<BookTopicFormData>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, formState } = form;
    const [initialData, setInitialData] = useState<BookTopicFormData>(defaultValues);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = useCallback(
        async (values: BookTopicFormData) => {
            setIsPending(true);
            try {
                const topic = await createAdminBookTopic(bookId, values);
                // Створюємо топік зі статистикою (новий топік завжди має 0 питань)
                const topicWithStats: DbTopicWithStats = {
                    ...topic,
                    totalQuestions: 0,
                    activeQuestions: 0,
                    inactiveQuestions: 0,
                    previewQuestions: 0,
                    questionsWithoutAnswers: 0,
                    isProcessing: false,
                    processingStartedAt: null
                };
                const nextInitial: BookTopicFormData = { titleUk: '', titleEn: '' };
                setInitialData(nextInitial);
                onTopicCreated(topicWithStats);
                toast.success(t('admin.booksTopicsCreateSuccess'));
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, {
                    titleUk: values.titleUk,
                    titleEn: values.titleEn
                });
                toast.error(t('admin.booksTopicsCreateError'));
            } finally {
                setIsPending(false);
            }
        },
        [bookId, onTopicCreated, t]
    );

    const submit = useCallback(() => {
        void handleSubmit(onSubmit)();
    }, [handleSubmit, onSubmit]);

    return (
        <div className="rounded-lg border border-dashed p-4 space-y-4">
            <div className="space-y-1">
                <h3 className="text-sm font-medium">{t('admin.booksTopicsCreateHeading')}</h3>
                <p className="text-xs text-muted-foreground">{t('admin.booksTopicsCreateDescription')}</p>
            </div>
            <Form {...form}>
                <div className="space-y-4" role="form" aria-label={t('admin.booksTopicsCreateHeading')}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={control}
                            name="titleUk"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>{t('admin.booksTopicsCreateTitleUk')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    submit();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="titleEn"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>{t('admin.booksTopicsCreateTitleEn')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    submit();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="button" disabled={isPending || !formState.isValid} onClick={submit}>
                            {t('admin.booksTopicsCreateSubmit')}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}
