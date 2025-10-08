'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';
import type { DbTopic } from '@/lib/repositories/topicRepository';

import { updateAdminBook } from '../actions';
import BookFormFields from '../components/BookFormFields';
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

    const { control, handleSubmit, reset, formState } = form;
    const [initialData, setInitialData] = useState<BookFormData>(initialFormData);
    const [isPending, setIsPending] = useState(false);

    const handleReset = useCallback(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = useCallback(
        async (values: BookFormData) => {
            setIsPending(true);
            try {
                const updated = await updateAdminBook(book.id, values);
                const nextInitial = mapBookToFormData(updated);
                setInitialData(nextInitial);
                reset(nextInitial);
                toast.success(t('admin.booksDetailSuccess'));
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { bookId: book.id });
                toast.error(t('admin.booksDetailError'));
            } finally {
                setIsPending(false);
            }
        },
        [book.id, reset, t]
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('admin.booksDetailTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('admin.booksDetailSubtitle')}</p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <BookFormFields control={control} subjects={subjects} topics={topics} />
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={handleReset} disabled={isPending || !formState.isDirty}>
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
