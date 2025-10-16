'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { clientLogger } from '@/lib/logger';
import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';
import type { DbTopicWithStats } from '@/lib/repositories/topicRepository';

import { createAdminBookTopics, deleteAdminBookTopic, updateAdminBook, type TopicSuggestionExisting, type TopicSuggestionNew } from '../actions';
import BookCoverField from '../components/BookCoverField';
import BookFormFields from '../components/BookFormFields';
import BookTopicCreateForm from '../components/BookTopicCreateForm';
import BookTopicsField from '../components/BookTopicsField';
import BookTopicSuggestionsDialog from '../components/bookTopicSuggestionsDialog/BookTopicSuggestionsDialog';
import { createBookFormSchema, type BookFormData } from '../schemas';
import { mapBookToFormData } from '../utils';

interface BookDetailPageClientProps {
    book: DbBookWithRelations;
    subjects: DbSubject[];
    topics: DbTopicWithStats[];
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
    const [currentBook, setCurrentBook] = useState<DbBookWithRelations>(book);
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const bookId = currentBook.id;
    const collator = useMemo(() => new Intl.Collator('uk', { sensitivity: 'base' }), []);
    const sortedTopics = useMemo(() => {
        const bookTopics = topics.filter((topic) => topic.bookId === bookId);

        return bookTopics.sort((a, b) => {
            // Пріоритет 1: Топіки без питань
            const aNoQuestions = a.totalQuestions === 0;
            const bNoQuestions = b.totalQuestions === 0;
            if (aNoQuestions && !bNoQuestions) return -1;
            if (!aNoQuestions && bNoQuestions) return 1;

            // Пріоритет 2: Топіки з питаннями в preview mode
            const aHasPreview = a.previewQuestions > 0;
            const bHasPreview = b.previewQuestions > 0;
            if (aHasPreview && !bHasPreview) return -1;
            if (!aHasPreview && bHasPreview) return 1;

            // Пріоритет 3: Топіки з неактивними питаннями
            const aHasInactive = a.inactiveQuestions > 0;
            const bHasInactive = b.inactiveQuestions > 0;
            if (aHasInactive && !bHasInactive) return -1;
            if (!aHasInactive && bHasInactive) return 1;

            // Всередині кожної категорії сортуємо за алфавітом
            return collator.compare(a.titleUk, b.titleUk);
        });
    }, [bookId, collator, topics]);
    const [availableTopics, setAvailableTopics] = useState<DbTopicWithStats[]>(sortedTopics);
    const [topicToDelete, setTopicToDelete] = useState<DbTopicWithStats | null>(null);
    const [isDeletingTopic, setIsDeletingTopic] = useState(false);
    useEffect(() => {
        setAvailableTopics(sortedTopics);
    }, [sortedTopics]);

    const handleCancel = useCallback(() => {
        router.push(appPaths.adminBooks);
    }, [router]);

    const handleDeleteDialogOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!nextOpen && !isDeletingTopic) {
                setTopicToDelete(null);
            }
        },
        [isDeletingTopic]
    );

    const handleTopicDeleteRequest = useCallback((topic: DbTopicWithStats) => {
        setTopicToDelete(topic);
    }, []);

    const onSubmit = useCallback(
        async (values: BookFormData) => {
            setIsPending(true);
            try {
                const updated = await updateAdminBook(bookId, values);
                const nextInitial = mapBookToFormData(updated);
                reset(nextInitial);
                setCurrentBook(updated);
                // Оновлюємо топіки з новими даними, але зберігаємо статистику з поточного стану
                const updatedTopics = updated.topics.filter((topic) => topic.bookId === bookId);
                const topicsWithStats = updatedTopics.map((topic) => {
                    const existingTopic = availableTopics.find((t) => t.id === topic.id);
                    return (
                        existingTopic || {
                            ...topic,
                            totalQuestions: 0,
                            activeQuestions: 0,
                            inactiveQuestions: 0,
                            previewQuestions: 0
                        }
                    );
                });
                setAvailableTopics(
                    topicsWithStats.sort((a, b) => {
                        const aNoQuestions = a.totalQuestions === 0;
                        const bNoQuestions = b.totalQuestions === 0;
                        if (aNoQuestions && !bNoQuestions) return -1;
                        if (!aNoQuestions && bNoQuestions) return 1;

                        const aHasPreview = a.previewQuestions > 0;
                        const bHasPreview = b.previewQuestions > 0;
                        if (aHasPreview && !bHasPreview) return -1;
                        if (!aHasPreview && bHasPreview) return 1;

                        const aHasInactive = a.inactiveQuestions > 0;
                        const bHasInactive = b.inactiveQuestions > 0;
                        if (aHasInactive && !bHasInactive) return -1;
                        if (!aHasInactive && bHasInactive) return 1;

                        return collator.compare(a.titleUk, b.titleUk);
                    })
                );
                toast.success(t('admin.booksDetailSuccess'));
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { bookId });
                toast.error(t('admin.booksDetailError'));
            } finally {
                setIsPending(false);
            }
        },
        [bookId, collator, reset, t, availableTopics]
    );

    const handleTopicCreated = useCallback(
        (topic: DbTopicWithStats) => {
            if (topic.bookId !== bookId) {
                return;
            }
            setAvailableTopics((prev) => {
                if (prev.some((item) => item.id === topic.id)) {
                    return prev;
                }
                const next = [...prev, topic];
                return next.sort((a, b) => {
                    // Використовуємо ту ж логіку сортування
                    const aNoQuestions = a.totalQuestions === 0;
                    const bNoQuestions = b.totalQuestions === 0;
                    if (aNoQuestions && !bNoQuestions) return -1;
                    if (!aNoQuestions && bNoQuestions) return 1;

                    const aHasPreview = a.previewQuestions > 0;
                    const bHasPreview = b.previewQuestions > 0;
                    if (aHasPreview && !bHasPreview) return -1;
                    if (!aHasPreview && bHasPreview) return 1;

                    const aHasInactive = a.inactiveQuestions > 0;
                    const bHasInactive = b.inactiveQuestions > 0;
                    if (aHasInactive && !bHasInactive) return -1;
                    if (!aHasInactive && bHasInactive) return 1;

                    return collator.compare(a.titleUk, b.titleUk);
                });
            });
            const nextSelected = Array.from(new Set([...getValues('topicIds'), topic.id]));
            setValue('topicIds', nextSelected, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        },
        [bookId, collator, getValues, setValue]
    );

    const handleConfirmTopicDelete = useCallback(async () => {
        if (!topicToDelete) {
            return;
        }
        setIsDeletingTopic(true);
        try {
            await deleteAdminBookTopic(bookId, topicToDelete.id);
            setAvailableTopics((prev) => prev.filter((topic) => topic.id !== topicToDelete.id));
            const nextTopicIds = getValues('topicIds').filter((id) => id !== topicToDelete.id);
            setValue('topicIds', nextTopicIds, { shouldDirty: false, shouldTouch: false, shouldValidate: true });
            toast.success(t('admin.booksTopicsDeleteSuccess'));
            setTopicToDelete(null);
        } catch (error) {
            clientLogger.error('Topic deletion failed', error as Error, { bookId, topicId: topicToDelete.id });
            toast.error(t('admin.booksTopicsDeleteError'));
        } finally {
            setIsDeletingTopic(false);
        }
    }, [bookId, getValues, setValue, t, topicToDelete]);

    const handleSuggestionApply = useCallback(
        async ({ existingTopics, newTopics }: { existingTopics: TopicSuggestionExisting[]; newTopics: TopicSuggestionNew[] }) => {
            if (existingTopics.length > 0) {
                const ids = existingTopics.map((topic) => topic.id).filter((id) => availableTopics.some((item) => item.id === id && item.bookId === bookId));
                if (ids.length > 0) {
                    const nextTopicIds = Array.from(new Set([...getValues('topicIds'), ...ids]));
                    setValue('topicIds', nextTopicIds, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                }
            }
            if (newTopics.length > 0) {
                const existingKeys = new Set(availableTopics.map((topic) => `${topic.titleUk.toLowerCase()}|${topic.titleEn.toLowerCase()}`));
                const payload = newTopics
                    .filter((topic) => !existingKeys.has(`${topic.titleUk.toLowerCase()}|${topic.titleEn.toLowerCase()}`))
                    .map((topic) => ({
                        titleUk: topic.titleUk,
                        titleEn: topic.titleEn
                    }));
                if (payload.length === 0) {
                    return;
                }
                try {
                    const createdTopics = await createAdminBookTopics(bookId, payload);
                    if (createdTopics.length === 0) {
                        return;
                    }
                    setAvailableTopics((prev) => {
                        const ids = new Set(prev.map((item) => item.id));
                        const merged = [...prev];
                        createdTopics.forEach((topic) => {
                            if (!ids.has(topic.id)) {
                                // Додаємо новий топік з базовою статистикою
                                const topicWithStats: DbTopicWithStats = {
                                    ...topic,
                                    totalQuestions: 0,
                                    activeQuestions: 0,
                                    inactiveQuestions: 0,
                                    previewQuestions: 0
                                };
                                merged.push(topicWithStats);
                                ids.add(topic.id);
                            }
                        });
                        return merged.sort((a, b) => {
                            const aNoQuestions = a.totalQuestions === 0;
                            const bNoQuestions = b.totalQuestions === 0;
                            if (aNoQuestions && !bNoQuestions) return -1;
                            if (!aNoQuestions && bNoQuestions) return 1;

                            const aHasPreview = a.previewQuestions > 0;
                            const bHasPreview = b.previewQuestions > 0;
                            if (aHasPreview && !bHasPreview) return -1;
                            if (!aHasPreview && bHasPreview) return 1;

                            const aHasInactive = a.inactiveQuestions > 0;
                            const bHasInactive = b.inactiveQuestions > 0;
                            if (aHasInactive && !bHasInactive) return -1;
                            if (!aHasInactive && bHasInactive) return 1;

                            return collator.compare(a.titleUk, b.titleUk);
                        });
                    });
                    const nextTopicIds = Array.from(new Set([...getValues('topicIds'), ...createdTopics.map((topic) => topic.id)]));
                    setValue('topicIds', nextTopicIds, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                } catch (error) {
                    clientLogger.error('Topic suggestion apply failed', error as Error, { bookId });
                    throw error;
                }
            }
        },
        [availableTopics, bookId, collator, getValues, setValue]
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('admin.booksDetailTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('admin.booksDetailSubtitle')}</p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <BookCoverField control={control} setValue={setValue} bookId={bookId} onBookUpdated={setCurrentBook} />
                    <BookFormFields control={control} subjects={subjects} />
                    <div className="space-y-4">
                        <BookTopicsField
                            control={control}
                            topics={availableTopics}
                            actions={<BookTopicSuggestionsDialog book={currentBook} onApply={handleSuggestionApply} />}
                            onDeleteTopic={handleTopicDeleteRequest}
                            deleteDisabled={isDeletingTopic}
                        />
                        <BookTopicCreateForm bookId={bookId} onTopicCreated={handleTopicCreated} />
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
            <Dialog open={Boolean(topicToDelete)} onOpenChange={handleDeleteDialogOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.booksTopicsDeleteConfirmTitle')}</DialogTitle>
                        <DialogDescription>{t('admin.booksTopicsDeleteConfirmDescription')}</DialogDescription>
                    </DialogHeader>
                    {topicToDelete && (
                        <div className="space-y-1 rounded-md border border-dashed p-3">
                            <p className="text-sm font-medium">{topicToDelete.titleUk}</p>
                            <p className="text-xs text-muted-foreground">{topicToDelete.titleEn}</p>
                        </div>
                    )}
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setTopicToDelete(null)} disabled={isDeletingTopic}>
                            {t('admin.booksTopicsDeleteConfirmCancel')}
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleConfirmTopicDelete} disabled={isDeletingTopic}>
                            {isDeletingTopic && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t('admin.booksTopicsDeleteConfirmSubmit')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
