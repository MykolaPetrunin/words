'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { clientLogger } from '@/lib/logger';
import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';
import type { DbTopic } from '@/lib/repositories/topicRepository';

import { updateAdminBook } from '../actions';
import BookFormFields from '../components/BookFormFields';
import BookTopicCreateForm from '../components/BookTopicCreateForm';
import BookTopicsField from '../components/BookTopicsField';
import { createBookFormSchema, type BookFormData } from '../schemas';
import { mapBookToFormData } from '../utils';

interface BookDetailPageClientProps {
    book: DbBookWithRelations;
    subjects: DbSubject[];
    topics: DbTopic[];
}

export default function BookDetailPageClient({ book, subjects, topics }: BookDetailPageClientProps): React.ReactElement {
    const t = useI18n();
    const initialFormData = useMemo(() => mapBookToFormData(book), [book]);
    const schema = useMemo(
        () =>
            createBookFormSchema({
                titleUk: t('admin.booksFormTitleUkRequired'),
                titleEn: t('admin.booksFormTitleEnRequired'),
                subjectIds: t('admin.booksFormSubjectsRequired')
            }),
        [t]
    );

    const form = useForm<BookFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialFormData,
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, formState, setValue, getValues } = form;
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const collator = useMemo(() => new Intl.Collator('uk', { sensitivity: 'base' }), []);
    const sortedTopics = useMemo(() => [...topics].sort((a, b) => collator.compare(a.titleUk, b.titleUk)), [collator, topics]);
    const [availableTopics, setAvailableTopics] = useState<DbTopic[]>(sortedTopics);

    useEffect(() => {
        setAvailableTopics((prev) => {
            const merged = [...prev];
            sortedTopics.forEach((topic) => {
                if (!merged.some((item) => item.id === topic.id)) {
                    merged.push(topic);
                }
            });
            return merged.sort((a, b) => collator.compare(a.titleUk, b.titleUk));
        });
    }, [collator, sortedTopics]);

    const handleCancel = useCallback(() => {
        router.push(appPaths.adminBooks);
    }, [router]);

    const onSubmit = useCallback(
        async (values: BookFormData) => {
            setIsPending(true);
            try {
                const updated = await updateAdminBook(book.id, values);
                const nextInitial = mapBookToFormData(updated);
                reset(nextInitial);
                setAvailableTopics((prev) => {
                    const merged = [...prev];
                    updated.topics.forEach((topic) => {
                        if (!merged.some((item) => item.id === topic.id)) {
                            merged.push(topic);
                        }
                    });
                    return merged.sort((a, b) => collator.compare(a.titleUk, b.titleUk));
                });
                toast.success(t('admin.booksDetailSuccess'));
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { bookId: book.id });
                toast.error(t('admin.booksDetailError'));
            } finally {
                setIsPending(false);
            }
        },
        [book.id, collator, reset, t]
    );

    const handleTopicCreated = useCallback(
        (topic: DbTopic) => {
            setAvailableTopics((prev) => {
                if (prev.some((item) => item.id === topic.id)) {
                    return prev;
                }
                const next = [...prev, topic];
                return next.sort((a, b) => collator.compare(a.titleUk, b.titleUk));
            });
            const nextSelected = Array.from(new Set([...getValues('topicIds'), topic.id]));
            setValue('topicIds', nextSelected, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        },
        [collator, getValues, setValue]
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('admin.booksDetailTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('admin.booksDetailSubtitle')}</p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <BookFormFields control={control} subjects={subjects} />
                    <div className="space-y-4">
                        <BookTopicsField control={control} topics={availableTopics} disabled={isPending} />
                        <BookTopicCreateForm onTopicCreated={handleTopicCreated} />
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending || !formState.isValid || !formState.isDirty}>
                            {t('admin.booksDetailSubmit')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
