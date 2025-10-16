'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, X } from 'lucide-react';
import NextImage from 'next/image';
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

import { deleteAdminSubjectCover, uploadAdminSubjectCover } from '../actions';
import { subjectFormSchema, type SubjectFormData } from '../schemas';
import { mapSubjectToFormData } from '../utils';

interface SubjectFormProps {
    subjectId?: string;
    initialValues: SubjectFormData;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    onSubmitAction: (values: SubjectFormData) => Promise<DbSubject>;
    onCancel: () => void;
    onSuccess: (subject: DbSubject) => void;
}

export default function SubjectForm({
    subjectId,
    initialValues,
    submitLabel,
    successMessage,
    errorMessage,
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

    const { control, handleSubmit, reset, formState, setValue, watch } = form;
    const [initialData, setInitialData] = useState<SubjectFormData>(initialValues);
    const [isPending, setIsPending] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const coverValue = watch('coverUrl');
    const coverInputId = useId();
    const coverFileInputRef = useRef<HTMLInputElement | null>(null);
    const hasSyncedInitialValues = useRef(false);

    const coverPlaceholder = useMemo(
        () => ({
            title: t('admin.subjectsCoverTitle'),
            upload: t('admin.subjectsCoverUpload'),
            replace: t('admin.subjectsCoverReplace'),
            remove: t('admin.subjectsCoverRemove'),
            invalidRatio: t('admin.subjectsCoverInvalidRatio'),
            invalidType: t('admin.subjectsCoverInvalidType'),
            invalidSize: t('admin.subjectsCoverInvalidSize'),
            uploadError: t('admin.subjectsCoverUploadError'),
            removeError: t('admin.subjectsCoverRemoveError')
        }),
        [t]
    );

    useEffect(() => {
        if (!hasSyncedInitialValues.current || !subjectId) {
            setInitialData(initialValues);
            reset(initialValues);
            hasSyncedInitialValues.current = true;
        }
    }, [initialValues, reset, subjectId]);

    useEffect(() => {
        hasSyncedInitialValues.current = false;
    }, [subjectId]);

    const handleCancel = useCallback(() => {
        reset(initialData);
        onCancel();
    }, [initialData, onCancel, reset]);

    const handleCoverRemove = useCallback(async () => {
        if (!coverValue) {
            return;
        }
        if (!subjectId) {
            setValue('coverUrl', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
            setInitialData((prev) => ({ ...prev, coverUrl: null }));
            return;
        }
        setIsUploadingCover(true);
        try {
            const result = await deleteAdminSubjectCover(subjectId);
            setValue('coverUrl', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
            setInitialData((prev) => ({ ...prev, coverUrl: null }));
            onSuccess(result.subject);
            if (coverFileInputRef.current) {
                coverFileInputRef.current.value = '';
            }
        } catch (error) {
            const err = error as Error;
            clientLogger.error('Subject cover remove failed', err, { subjectId });
            toast.error(coverPlaceholder.removeError);
        } finally {
            setIsUploadingCover(false);
        }
    }, [coverPlaceholder.removeError, coverValue, onSuccess, setInitialData, setValue, subjectId]);

    const handleCoverClick = useCallback(() => {
        if (isUploadingCover) {
            return;
        }
        coverFileInputRef.current?.click();
    }, [isUploadingCover]);

    const handleCoverUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(coverPlaceholder.invalidType);
                event.target.value = '';
                return;
            }

            const maxSizeBytes = 5 * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                toast.error(coverPlaceholder.invalidSize);
                event.target.value = '';
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            try {
                const { naturalWidth, naturalHeight } = await new Promise<{ naturalWidth: number; naturalHeight: number }>((resolve, reject) => {
                    const image = new globalThis.Image();
                    image.onload = () => resolve({ naturalWidth: image.width, naturalHeight: image.height });
                    image.onerror = () => reject(new Error('failed-to-load-image'));
                    image.src = objectUrl;
                });
                const ratio = naturalWidth / naturalHeight;
                const targetRatio = 2 / 3;
                if (Math.abs(ratio - targetRatio) > 0.05) {
                    throw new Error('invalid-aspect');
                }

                const formData = new FormData();
                formData.append('file', file);
                setIsUploadingCover(true);
                const result = await uploadAdminSubjectCover(formData, subjectId ?? null);
                setValue('coverUrl', result.url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                setInitialData((prev) => ({ ...prev, coverUrl: result.url }));
                if (result.subject) {
                    onSuccess(result.subject);
                }
            } catch (error) {
                const err = error as Error;
                if (err.message === 'invalid-type') {
                    toast.error(coverPlaceholder.invalidType);
                } else if (err.message === 'file-too-large') {
                    toast.error(coverPlaceholder.invalidSize);
                } else if (err.message === 'invalid-aspect') {
                    toast.error(coverPlaceholder.invalidRatio);
                } else {
                    clientLogger.error('Subject cover upload failed', err, { subjectId: subjectId ?? 'new-subject' });
                    toast.error(coverPlaceholder.uploadError);
                }
            } finally {
                setIsUploadingCover(false);
                URL.revokeObjectURL(objectUrl);
                event.target.value = '';
            }
        },
        [
            coverPlaceholder.invalidRatio,
            coverPlaceholder.invalidSize,
            coverPlaceholder.invalidType,
            coverPlaceholder.uploadError,
            onSuccess,
            setInitialData,
            setValue,
            subjectId
        ]
    );

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
                    name="coverUrl"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>{coverPlaceholder.title}</FormLabel>
                            <FormControl>
                                <div className="space-y-3">
                                    <input ref={field.ref} type="hidden" value={field.value ?? ''} onChange={field.onChange} name={field.name} />
                                    <input
                                        ref={(node) => {
                                            coverFileInputRef.current = node;
                                        }}
                                        id={coverInputId}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/avif"
                                        className="hidden"
                                        onChange={handleCoverUpload}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCoverClick}
                                        className="group relative aspect-[2/3] w-40 overflow-hidden rounded-lg border bg-muted transition hover:border-primary"
                                        aria-label={coverValue ? coverPlaceholder.replace : coverPlaceholder.upload}
                                        disabled={isUploadingCover}
                                    >
                                        {coverValue ? (
                                            <NextImage
                                                src={coverValue}
                                                alt={coverPlaceholder.title}
                                                fill
                                                sizes="160px"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                priority
                                            />
                                        ) : null}
                                        <div
                                            className={
                                                isUploadingCover
                                                    ? 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white opacity-100'
                                                    : coverValue
                                                      ? 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100'
                                                      : 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white opacity-100'
                                            }
                                        >
                                            {isUploadingCover ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                                            <span className="text-xs font-medium">{coverValue ? coverPlaceholder.replace : coverPlaceholder.upload}</span>
                                        </div>
                                        {!coverValue && !isUploadingCover ? (
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                                                {coverPlaceholder.title}
                                            </div>
                                        ) : null}
                                    </button>
                                    {coverValue ? (
                                        <Button type="button" variant="ghost" onClick={handleCoverRemove} disabled={isUploadingCover} className="h-8 px-3">
                                            <X className="mr-2 h-4 w-4" />
                                            {coverPlaceholder.remove}
                                        </Button>
                                    ) : null}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                    <Button type="submit" disabled={isPending || isUploadingCover || !formState.isValid}>
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
