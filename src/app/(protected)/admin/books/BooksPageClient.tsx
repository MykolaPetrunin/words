'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import { getAdminBookPath } from '@/lib/appPaths';
import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';
import type { DbTopic } from '@/lib/repositories/topicRepository';

import { createAdminBook } from './actions';
import { createBookFormSchema, type BookFormData } from './schemas';
import { createEmptyBookFormData } from './utils';
import BookFormFields from './components/BookFormFields';

interface BookFormProps {
    initialValues: BookFormData;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    isOpen: boolean;
    subjects: DbSubject[];
    topics: DbTopic[];
    onSubmitAction: (values: BookFormData) => Promise<DbBookWithRelations>;
    onClose: () => void;
    onSuccess: (book: DbBookWithRelations) => void;
    showStatusSwitch?: boolean;
    showTopics?: boolean;
}

function BookForm({
    initialValues,
    submitLabel,
    successMessage,
    errorMessage,
    isOpen,
    subjects,
    topics,
    onSubmitAction,
    onClose,
    onSuccess,
    showStatusSwitch = true,
    showTopics = true
}: BookFormProps): React.ReactElement {
    const t = useI18n();
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
        defaultValues: initialValues,
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, formState } = form;
    const [initialData, setInitialData] = useState<BookFormData>(initialValues);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInitialData(initialValues);
            reset(initialValues);
        }
    }, [initialValues, isOpen, reset]);

    const handleCancel = useCallback(() => {
        reset(initialData);
        onClose();
    }, [initialData, onClose, reset]);

    const onSubmit = useCallback(
        async (values: BookFormData) => {
            setIsPending(true);
            try {
                const book = await onSubmitAction(values);
                const emptyValues = createEmptyBookFormData();
                setInitialData(emptyValues);
                reset(emptyValues);
                onSuccess(book);
                onClose();
                toast.success(successMessage);
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { bookId: 'new-book' });
                toast.error(errorMessage);
            } finally {
                setIsPending(false);
            }
        },
        [errorMessage, onClose, onSubmitAction, onSuccess, reset, successMessage]
    );

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <BookFormFields control={control} subjects={subjects} topics={topics} showStatusSwitch={showStatusSwitch} showTopics={showTopics} />

                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={isPending || !formState.isValid}>
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

interface BooksPageClientProps {
    initialBooks: DbBookWithRelations[];
    subjects: DbSubject[];
    topics: DbTopic[];
}

export default function BooksPageClient({ initialBooks, subjects, topics }: BooksPageClientProps): React.ReactElement {
    const t = useI18n();
    const [books, setBooks] = useState<DbBookWithRelations[]>(() => initialBooks);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const createCopy = useMemo(
        () => ({
            title: t('admin.booksCreateTitle'),
            description: t('admin.booksCreateDescription'),
            submit: t('admin.booksCreateSubmit'),
            success: t('admin.booksCreateSuccess'),
            error: t('admin.booksCreateError')
        }),
        [t]
    );

    const handleCreateSuccess = useCallback((book: DbBookWithRelations) => {
        setBooks((prev) => [...prev, book]);
    }, []);

    const handleCreateClose = useCallback((open: boolean) => {
        if (!open) {
            setIsCreateOpen(false);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">{t('admin.booksTitle')}</h1>
                    <p className="text-sm text-muted-foreground">{t('admin.booksSubtitle')}</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={handleCreateClose}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateOpen(true)}>{t('admin.booksCreateButton')}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{createCopy.title}</DialogTitle>
                            <DialogDescription>{createCopy.description}</DialogDescription>
                        </DialogHeader>
                        <BookForm
                            initialValues={createEmptyBookFormData()}
                            submitLabel={createCopy.submit}
                            successMessage={createCopy.success}
                            errorMessage={createCopy.error}
                            isOpen={isCreateOpen}
                            subjects={subjects}
                            topics={topics}
                            onSubmitAction={createAdminBook}
                            onClose={() => setIsCreateOpen(false)}
                            onSuccess={handleCreateSuccess}
                            showStatusSwitch={false}
                            showTopics={false}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {books.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">{t('admin.booksEmpty')}</div>
            ) : (
                <div className="grid gap-4">
                    {books.map((book) => {
                        const editPath = getAdminBookPath(book.id);
                        return (
                            <div key={book.id} className="space-y-3 rounded-lg border p-4 shadow-xs">
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-lg font-semibold">{book.titleUk}</p>
                                        <p className="text-sm text-muted-foreground">{book.titleEn}</p>
                                    </div>
                                    <span
                                        className={
                                            book.isActive
                                                ? 'inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'
                                                : 'inline-flex items-center justify-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700'
                                        }
                                    >
                                        {book.isActive ? t('admin.booksStatusActive') : t('admin.booksStatusInactive')}
                                    </span>
                                </div>
                                {(book.descriptionUk && book.descriptionUk.length > 0) || (book.descriptionEn && book.descriptionEn.length > 0) ? (
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {book.descriptionUk && book.descriptionUk.length > 0 ? (
                                            <p className="text-sm leading-relaxed text-muted-foreground">{book.descriptionUk}</p>
                                        ) : null}
                                        {book.descriptionEn && book.descriptionEn.length > 0 ? (
                                            <p className="text-sm leading-relaxed text-muted-foreground">{book.descriptionEn}</p>
                                        ) : null}
                                    </div>
                                ) : null}
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {book.subjects.map((subject) => (
                                        <span key={subject.id} className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                                            {subject.nameUk}
                                        </span>
                                    ))}
                                    {book.subjects.length === 0 ? (
                                        <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{t('admin.booksNoSubjects')}</span>
                                    ) : null}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {book.topics.map((topic) => (
                                        <span key={topic.id} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                                            {topic.titleUk}
                                        </span>
                                    ))}
                                    {book.topics.length === 0 ? (
                                        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{t('admin.booksNoTopics')}</span>
                                    ) : null}
                                </div>
                                <div className="flex justify-end">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={editPath}>{t('admin.booksEditButton')}</Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
