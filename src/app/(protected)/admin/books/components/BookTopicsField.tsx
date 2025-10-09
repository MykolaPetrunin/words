'use client';

import React from 'react';
import type { Control } from 'react-hook-form';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useI18n } from '@/hooks/useI18n';
import type { DbTopic } from '@/lib/repositories/topicRepository';

import type { BookFormData } from '../schemas';

interface BookTopicsFieldProps {
    control: Control<BookFormData>;
    topics: readonly DbTopic[];
    disabled?: boolean;
    actions?: React.ReactNode;
}

export default function BookTopicsField({ control, topics, disabled = false, actions }: BookTopicsFieldProps): React.ReactElement {
    const t = useI18n();

    return (
        <FormField
            control={control}
            name="topicIds"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <FormLabel className="text-base leading-none">{t('admin.booksFormTopics')}</FormLabel>
                        {actions}
                    </div>
                    {topics.length === 0 ? (
                        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{t('admin.booksFormTopicsEmpty')}</p>
                    ) : (
                        <div className="grid gap-2">
                            {topics.map((topic) => {
                                const checked = field.value.includes(topic.id);
                                return (
                                    <label key={topic.id} className="flex items-center justify-between rounded-md border border-dashed p-3">
                                        <div>
                                            <p className="text-sm font-medium">{topic.titleUk}</p>
                                            <p className="text-xs text-muted-foreground">{topic.titleEn}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            value={topic.id}
                                            checked={checked}
                                            disabled={disabled}
                                            onChange={(event) => {
                                                const { checked: isChecked } = event.target;
                                                if (isChecked) {
                                                    field.onChange([...field.value, topic.id]);
                                                } else {
                                                    field.onChange(field.value.filter((id) => id !== topic.id));
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
    );
}
