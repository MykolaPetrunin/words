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
import type { DbSubject } from '@/lib/repositories/subjectRepository';

import { createAdminSubject, updateAdminSubject } from './actions';
import { subjectFormSchema, type SubjectFormData } from './schemas';

interface SubjectFormProps {
    subjectId?: string;
    initialValues: SubjectFormData;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    isOpen: boolean;
    onSubmitAction: (values: SubjectFormData) => Promise<DbSubject>;
    onCancel: () => void;
    onSuccess: (subject: DbSubject) => void;
}

const mapSubjectToFormData = (subject: DbSubject): SubjectFormData => ({
    nameUk: subject.nameUk,
    nameEn: subject.nameEn,
    descriptionUk: subject.descriptionUk ?? '',
    descriptionEn: subject.descriptionEn ?? '',
    isActive: subject.isActive
});

const emptySubjectFormData: SubjectFormData = {
    nameUk: '',
    nameEn: '',
    descriptionUk: '',
    descriptionEn: '',
    isActive: true
};

function SubjectForm({
    subjectId,
    initialValues,
    submitLabel,
    successMessage,
    errorMessage,
    isOpen,
    onSubmitAction,
    onCancel,
    onSuccess
}: SubjectFormProps): React.ReactElement {
    const t = useI18n();
    const form = useForm<SubjectFormData>({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: initialValues,
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, formState } = form;
    const [initialData, setInitialData] = useState<SubjectFormData>(initialValues);
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
        async (values: SubjectFormData) => {
            setIsPending(true);
            try {
                const subject = await onSubmitAction(values);
                const nextInitial = mapSubjectToFormData(subject);
                setInitialData(nextInitial);
                reset(nextInitial);
                onSuccess(subject);
                toast.success(successMessage);
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { subjectId: subjectId ?? 'new-subject' });
                toast.error(errorMessage);
            } finally {
                setIsPending(false);
            }
        },
        [errorMessage, onSubmitAction, onSuccess, reset, subjectId, successMessage]
    );

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="nameUk"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('admin.subjectsFormNameUk')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="nameEn"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('admin.subjectsFormNameEn')}</FormLabel>
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
                                <FormLabel>{t('admin.subjectsFormDescriptionUk')}</FormLabel>
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
                                <FormLabel>{t('admin.subjectsFormDescriptionEn')}</FormLabel>
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
                            <FormLabel className="text-sm font-medium">{t('admin.subjectsFormIsActive')}</FormLabel>
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

interface SubjectsPageClientProps {
    initialSubjects: DbSubject[];
}

export default function SubjectsPageClient({ initialSubjects }: SubjectsPageClientProps): React.ReactElement {
    const t = useI18n();
    const [subjects, setSubjects] = useState<DbSubject[]>(() => initialSubjects);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<DbSubject | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const createCopy = useMemo(
        () => ({
            title: t('admin.subjectsCreateTitle'),
            description: t('admin.subjectsCreateDescription'),
            submit: t('admin.subjectsCreateSubmit'),
            success: t('admin.subjectsCreateSuccess'),
            error: t('admin.subjectsCreateError')
        }),
        [t]
    );

    const editCopy = useMemo(
        () => ({
            title: t('admin.subjectsEditTitle'),
            description: t('admin.subjectsEditDescription'),
            submit: t('admin.subjectsEditSubmit'),
            success: t('admin.subjectsEditSuccess'),
            error: t('admin.subjectsEditError')
        }),
        [t]
    );

    const handleCreateSuccess = useCallback((subject: DbSubject) => {
        setSubjects((prev) => [...prev, subject]);
        setIsCreateOpen(false);
    }, []);

    const handleEditSuccess = useCallback((subject: DbSubject) => {
        setSubjects((prev) => prev.map((item) => (item.id === subject.id ? subject : item)));
        setIsEditOpen(false);
        setEditingSubject(null);
    }, []);

    const handleEditOpen = useCallback((subject: DbSubject) => {
        setEditingSubject(subject);
        setIsEditOpen(true);
    }, []);

    const handleEditClose = useCallback((open: boolean) => {
        if (!open) {
            setIsEditOpen(false);
            setEditingSubject(null);
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
                    <h1 className="text-2xl font-semibold">{t('admin.subjectsTitle')}</h1>
                    <p className="text-sm text-muted-foreground">{t('admin.subjectsSubtitle')}</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={handleCreateClose}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateOpen(true)}>{t('admin.subjectsCreateButton')}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{createCopy.title}</DialogTitle>
                            <DialogDescription>{createCopy.description}</DialogDescription>
                        </DialogHeader>
                        <SubjectForm
                            initialValues={{ ...emptySubjectFormData }}
                            submitLabel={createCopy.submit}
                            successMessage={createCopy.success}
                            errorMessage={createCopy.error}
                            isOpen={isCreateOpen}
                            onSubmitAction={createAdminSubject}
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {subjects.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">{t('admin.subjectsEmpty')}</div>
            ) : (
                <div className="grid gap-4">
                    {subjects.map((subject) => (
                        <div key={subject.id} className="space-y-3 rounded-lg border p-4 shadow-xs">
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-lg font-semibold">{subject.nameUk}</p>
                                    <p className="text-sm text-muted-foreground">{subject.nameEn}</p>
                                </div>
                                <span
                                    className={
                                        subject.isActive
                                            ? 'inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'
                                            : 'inline-flex items-center justify-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700'
                                    }
                                >
                                    {subject.isActive ? t('admin.subjectsStatusActive') : t('admin.subjectsStatusInactive')}
                                </span>
                            </div>
                            {(subject.descriptionUk && subject.descriptionUk.length > 0) || (subject.descriptionEn && subject.descriptionEn.length > 0) ? (
                                <div className="grid gap-3 md:grid-cols-2">
                                    {subject.descriptionUk && subject.descriptionUk.length > 0 ? (
                                        <p className="text-sm leading-relaxed text-muted-foreground">{subject.descriptionUk}</p>
                                    ) : null}
                                    {subject.descriptionEn && subject.descriptionEn.length > 0 ? (
                                        <p className="text-sm leading-relaxed text-muted-foreground">{subject.descriptionEn}</p>
                                    ) : null}
                                </div>
                            ) : null}
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => handleEditOpen(subject)}>
                                    {t('admin.subjectsEditButton')}
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
                    {editingSubject ? (
                        <SubjectForm
                            subjectId={editingSubject.id}
                            initialValues={mapSubjectToFormData(editingSubject)}
                            submitLabel={editCopy.submit}
                            successMessage={editCopy.success}
                            errorMessage={editCopy.error}
                            isOpen={isEditOpen}
                            onSubmitAction={(values) => updateAdminSubject(editingSubject.id, values)}
                            onSuccess={handleEditSuccess}
                            onCancel={() => handleEditClose(false)}
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}
