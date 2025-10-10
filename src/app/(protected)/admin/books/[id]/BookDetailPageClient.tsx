'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

import { createAdminBookTopics, updateAdminBook, type TopicSuggestionExisting, type TopicSuggestionNew } from '../actions';
import BookFormFields from '../components/BookFormFields';
import BookPendingTopicsList from '../components/BookPendingTopicsList';
import BookTopicCreateForm from '../components/BookTopicCreateForm';
import BookTopicsField from '../components/BookTopicsField';
import BookTopicSuggestionsDialog from '../components/bookTopicSuggestionsDialog/BookTopicSuggestionsDialog';
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
    const [pendingTopics, setPendingTopics] = useState<TopicSuggestionNew[]>([]);
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
                const topicsToCreate = pendingTopics.map((topic) => ({
                    titleUk: topic.titleUk,
                    titleEn: topic.titleEn
                }));
                const createdTopics = topicsToCreate.length > 0 ? await createAdminBookTopics(topicsToCreate) : [];
                const nextTopicIds = Array.from(new Set([...values.topicIds, ...createdTopics.map((topic) => topic.id)]));
                const updated = await updateAdminBook(book.id, { ...values, topicIds: nextTopicIds });
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
                setPendingTopics([]);
                toast.success(t('admin.booksDetailSuccess'));
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { bookId: book.id });
                toast.error(t('admin.booksDetailError'));
            } finally {
                setIsPending(false);
            }
        },
        [book.id, collator, pendingTopics, reset, t]
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

    const handleSuggestionApply = useCallback(
        ({ existingTopics, newTopics }: { existingTopics: TopicSuggestionExisting[]; newTopics: TopicSuggestionNew[] }) => {
            if (existingTopics.length > 0) {
                setAvailableTopics((prev) => {
                    const map = new Map(prev.map((topic) => [topic.id, topic]));
                    existingTopics.forEach((topic) => {
                        if (!map.has(topic.id)) {
                            map.set(topic.id, { id: topic.id, titleUk: topic.titleUk, titleEn: topic.titleEn });
                        }
                    });
                    return Array.from(map.values()).sort((a, b) => collator.compare(a.titleUk, b.titleUk));
                });
                const nextTopicIds = Array.from(new Set([...getValues('topicIds'), ...existingTopics.map((topic) => topic.id)]));
                setValue('topicIds', nextTopicIds, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
            }
            if (newTopics.length > 0) {
                setPendingTopics((prev) => {
                    const map = new Map<string, TopicSuggestionNew>();
                    prev.forEach((topic) => {
                        map.set(`${topic.titleUk.toLowerCase()}|${topic.titleEn.toLowerCase()}`, topic);
                    });
                    newTopics.forEach((topic) => {
                        const key = `${topic.titleUk.toLowerCase()}|${topic.titleEn.toLowerCase()}`;
                        const existing = map.get(key);
                        if (!existing || (existing.priority === 'optional' && topic.priority === 'strong')) {
                            map.set(key, topic);
                        }
                    });
                    return Array.from(map.values());
                });
            }
        },
        [collator, getValues, setValue]
    );

    const handlePendingTopicRemove = useCallback((topic: TopicSuggestionNew) => {
        setPendingTopics((prev) =>
            prev.filter((item) => item.titleUk.toLowerCase() !== topic.titleUk.toLowerCase() || item.titleEn.toLowerCase() !== topic.titleEn.toLowerCase())
        );
    }, []);

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
                        <BookTopicsField
                            control={control}
                            topics={availableTopics}
                            disabled={isPending}
                            actions={<BookTopicSuggestionsDialog book={book} onApply={handleSuggestionApply} />}
                        />
                        <BookPendingTopicsList topics={pendingTopics} onRemove={handlePendingTopicRemove} disabled={isPending} />
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
