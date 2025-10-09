'use client';

import React from 'react';
import type { Control } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

import type { BookFormData } from '../schemas';

interface BookFormFieldsProps {
    control: Control<BookFormData>;
    subjects: DbSubject[];
    showStatusSwitch?: boolean;
}

export default function BookFormFields({ control, subjects, showStatusSwitch = true }: BookFormFieldsProps): React.ReactElement {
    const t = useI18n();

    return (
        <div className="space-y-4">
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

            {showStatusSwitch ? (
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
            ) : null}

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
        </div>
    );
}
