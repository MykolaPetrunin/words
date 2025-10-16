'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import NextImage from 'next/image';
import { Upload, Loader2, X } from 'lucide-react';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';

import { deleteAdminBookCover, uploadAdminBookCover } from '../actions';
import type { BookFormData } from '../schemas';

interface BookCoverFieldProps {
    control: Control<BookFormData>;
    setValue: UseFormSetValue<BookFormData>;
    bookId: string;
    onBookUpdated: (book: DbBookWithRelations) => void;
}

const aspectTolerance = 0.05;

export default function BookCoverField({ control, setValue, bookId, onBookUpdated }: BookCoverFieldProps): React.ReactElement {
    const t = useI18n();
    const coverValue = useWatch({ control, name: 'coverUrl' }) as string | null;
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const copy = useMemo(
        () => ({
            title: t('admin.booksCoverTitle'),
            upload: t('admin.booksCoverUpload'),
            replace: t('admin.booksCoverReplace'),
            remove: t('admin.booksCoverRemove'),
            invalidRatio: t('admin.booksCoverInvalidRatio'),
            invalidType: t('admin.booksCoverInvalidType'),
            invalidSize: t('admin.booksCoverInvalidSize'),
            uploadError: t('admin.booksCoverUploadError'),
            removeError: t('admin.booksCoverRemoveError'),
            empty: t('admin.booksCoverEmpty')
        }),
        [t]
    );

    const handleClick = useCallback(() => {
        if (isUploading) {
            return;
        }
        inputRef.current?.click();
    }, [isUploading]);

    const resetInputValue = (): void => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(copy.invalidType);
                resetInputValue();
                return;
            }

            const maxSizeBytes = 5 * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                toast.error(copy.invalidSize);
                resetInputValue();
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
                if (Math.abs(ratio - targetRatio) > aspectTolerance) {
                    throw new Error('invalid-aspect');
                }

                const formData = new FormData();
                formData.append('file', file);
                setIsUploading(true);
                const result = await uploadAdminBookCover(bookId, formData);
                setValue('coverUrl', result.url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                onBookUpdated(result.book);
            } catch (error) {
                const err = error as Error;
                if (err.message === 'invalid-type') {
                    toast.error(copy.invalidType);
                } else if (err.message === 'file-too-large') {
                    toast.error(copy.invalidSize);
                } else if (err.message === 'invalid-aspect') {
                    toast.error(copy.invalidRatio);
                } else {
                    clientLogger.error('Book cover upload failed', err, { bookId });
                    toast.error(copy.uploadError);
                }
            } finally {
                setIsUploading(false);
                URL.revokeObjectURL(objectUrl);
                resetInputValue();
            }
        },
        [bookId, copy.invalidRatio, copy.invalidSize, copy.invalidType, copy.uploadError, onBookUpdated, setValue]
    );

    const handleRemove = useCallback(async () => {
        if (isUploading || !coverValue) {
            return;
        }
        setIsUploading(true);
        try {
            const result = await deleteAdminBookCover(bookId);
            setValue('coverUrl', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
            onBookUpdated(result.book);
            resetInputValue();
        } catch (error) {
            clientLogger.error('Book cover remove failed', error as Error, { bookId });
            toast.error(copy.removeError);
        } finally {
            setIsUploading(false);
        }
    }, [bookId, copy.removeError, coverValue, isUploading, onBookUpdated, setValue]);

    return (
        <FormField
            control={control}
            name="coverUrl"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>{copy.title}</FormLabel>
                    <FormControl>
                        <div className="space-y-3">
                            <input ref={field.ref} type="hidden" value={field.value ?? ''} onChange={field.onChange} name={field.name} />
                            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleUpload} />
                            <button
                                type="button"
                                onClick={handleClick}
                                className="group relative aspect-[2/3] w-40 overflow-hidden rounded-lg border bg-muted transition hover:border-primary"
                                aria-label={coverValue ? copy.replace : copy.upload}
                                disabled={isUploading}
                            >
                                {coverValue ? (
                                    <NextImage
                                        src={coverValue}
                                        alt={copy.title}
                                        fill
                                        sizes="160px"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : null}
                                <div
                                    className={
                                        isUploading
                                            ? 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white opacity-100'
                                            : coverValue
                                              ? 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100'
                                              : 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white opacity-100'
                                    }
                                >
                                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                                    <span className="text-xs font-medium">{coverValue ? copy.replace : copy.upload}</span>
                                </div>
                                {!coverValue && !isUploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs text-muted-foreground">{copy.empty}</div>
                                ) : null}
                            </button>
                            {coverValue ? (
                                <Button type="button" variant="ghost" onClick={handleRemove} disabled={isUploading} className="h-8 px-3">
                                    <X className="mr-2 h-4 w-4" />
                                    {copy.remove}
                                </Button>
                            ) : null}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
