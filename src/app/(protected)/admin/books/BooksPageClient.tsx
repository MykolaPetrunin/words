'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbBookWithSubjects } from '@/lib/repositories/bookRepository';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

import { createAdminBook, updateAdminBook } from './actions';
import { bookFormSchema, type BookFormData } from './schemas';

interface BookFormProps {
    bookId?: string;
    initialValues: BookFormData;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    isOpen: boolean;
    subjects: DbSubject[];
    onSubmitAction: (values: BookFormData) => Promise<DbBookWithSubjects>;
    onCancel: () => void;
    onSuccess: (book: DbBookWithSubjects) => void;
}

const mapBookToFormData = (book: DbBookWithSubjects): BookFormData => ({
    titleUk: book.titleUk,
    titleEn: book.titleEn,
    descriptionUk: book.descriptionUk ?? '',
    descriptionEn: book.descriptionEn ?? '',
    isActive: book.isActive,
    subjectIds: book.subjects.map((subject) => subject.id)
});

const emptyBookFormData: BookFormData = {
    titleUk: '',
    titleEn: '',
    descriptionUk: '',
    descriptionEn: '',
    isActive: true,
    subjectIds: []
};

function BookForm({
    bookId,
    initialValues,
    submitLabel,
    successMessage,
    errorMessage,
    isOpen,
    subjects,
    onSubmitAction,
    onCancel,
    onSuccess
}: BookFormProps): React.ReactElement {
    const t = useI18n();
    const form = useForm<BookFormData>({
        resolver: zodResolver(bookFormSchema),
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
        onCancel();
    }, [initialData, onCancel, reset]);

    const onSubmit = useCallback(
        async (values: BookFormData) => {
            setIsPending(true);
            try {
                const book = await onSubmitAction(values);
                const nextInitial = mapBookToFormData(book);
                setInitialData(nextInitial);
                reset(nextInitial);
                onSuccess(book);
                toast.success(successMessage);
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { bookId: bookId ?? 'new-book' });
                toast.error(errorMessage);
            } finally {
                setIsPending(false);
            }
        },
        [bookId, errorMessage, onSubmitAction, onSuccess, reset, successMessage]
    );

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="titleUk"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('admin.booksFormTitleUk')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>{t('admin.booksFormTitleEn')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="descriptionUk"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('admin.booksFormDescriptionUk')}</FormLabel>
                                <FormControl>
                                    <textarea
                                        ref={field.ref}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="descriptionEn"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('admin.booksFormDescriptionEn')}</FormLabel>
                                <FormControl>
                                    <textarea
                                        ref={field.ref}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border border-dashed p-3">
                            <FormLabel className="text-sm font-medium">{t('admin.booksFormIsActive')}</FormLabel>
                            <FormControl>
                                <input
                                    ref={field.ref}
                                    checked={field.value}
                                    onChange={(event) => field.onChange(event.target.checked)}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border border-input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="subjectIds"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>{t('admin.booksFormSubjects')}</FormLabel>
                            {subjects.length === 0 ? (
                                <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{t('admin.booksFormSubjectsEmpty')}</p>
                            ) : (
                                <div className="grid gap-2">
                                    {subjects.map((subject) => {
                                        const checked = field.value.includes(subject.id);
                                        return (
                                            <label key={subject.id} className="flex items-center justify-between rounded-md border border-dashed p-3">
                                                <div>
                                                    <p className="text-sm font-medium">{subject.nameUk}</p>
                                                    <p className="text-xs text-muted-foreground">{subject.nameEn}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    value={subject.id}
                                                    checked={checked}
                                                    onChange={(event) => {
                                                        const { checked: isChecked } = event.target;
                                                        if (isChecked) {
                                                            field.onChange([...field.value, subject.id]);
                                                        } else {
                                                            field.onChange(field.value.filter((id) => id !== subject.id));
                                                        }
                                                    }}
                                                    className="h-4 w-4 rounded border border-input"
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
    initialBooks: DbBookWithSubjects[];
    subjects: DbSubject[];
}

export default function BooksPageClient({ initialBooks, subjects }: BooksPageClientProps): React.ReactElement {
    const t = useI18n();
    const [books, setBooks] = useState<DbBookWithSubjects[]>(() => initialBooks);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<DbBookWithSubjects | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

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

    const editCopy = useMemo(
        () => ({
            title: t('admin.booksEditTitle'),
            description: t('admin.booksEditDescription'),
            submit: t('admin.booksEditSubmit'),
            success: t('admin.booksEditSuccess'),
            error: t('admin.booksEditError')
        }),
        [t]
    );

    const handleCreateSuccess = useCallback((book: DbBookWithSubjects) => {
        setBooks((prev) => [...prev, book]);
        setIsCreateOpen(false);
    }, []);

    const handleEditSuccess = useCallback((book: DbBookWithSubjects) => {
        setBooks((prev) => prev.map((item) => (item.id === book.id ? book : item)));
        setIsEditOpen(false);
        setEditingBook(null);
    }, []);

    const handleEditOpen = useCallback((book: DbBookWithSubjects) => {
        setEditingBook(book);
        setIsEditOpen(true);
    }, []);

    const handleEditClose = useCallback((open: boolean) => {
        if (!open) {
            setIsEditOpen(false);
            setEditingBook(null);
        }
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
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{createCopy.title}</DialogTitle>
                            <DialogDescription>{createCopy.description}</DialogDescription>
                        </DialogHeader>
                        <BookForm
                            initialValues={{ ...emptyBookFormData }}
                            submitLabel={createCopy.submit}
                            successMessage={createCopy.success}
                            errorMessage={createCopy.error}
                            isOpen={isCreateOpen}
                            subjects={subjects}
                            onSubmitAction={createAdminBook}
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {books.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">{t('admin.booksEmpty')}</div>
            ) : (
                <div className="grid gap-4">
                    {books.map((book) => (
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
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => handleEditOpen(book)}>
                                    {t('admin.booksEditButton')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={isEditOpen} onOpenChange={handleEditClose}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editCopy.title}</DialogTitle>
                        <DialogDescription>{editCopy.description}</DialogDescription>
                    </DialogHeader>
                    {editingBook ? (
                        <BookForm
                            bookId={editingBook.id}
                            initialValues={mapBookToFormData(editingBook)}
                            submitLabel={editCopy.submit}
                            successMessage={editCopy.success}
                            errorMessage={editCopy.error}
                            isOpen={isEditOpen}
                            subjects={subjects}
                            onSubmitAction={(values) => updateAdminBook(editingBook.id, values)}
                            onSuccess={handleEditSuccess}
                            onCancel={() => handleEditClose(false)}
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}
