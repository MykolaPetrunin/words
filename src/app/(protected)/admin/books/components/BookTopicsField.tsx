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
    actions?: React.ReactNode;
}

export default function BookTopicsField({ control, topics, actions }: BookTopicsFieldProps): React.ReactElement {
    const t = useI18n();

    return (
        <FormField
            control={control}
            name="topicIds"
            render={({ field }) => {
                const selected = new Set(field.value);
                const selectedTopics = topics.filter((topic) => selected.has(topic.id));
                return (
                    <FormItem className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <FormLabel className="text-base leading-none">{t('admin.booksFormTopics')}</FormLabel>
                            {actions}
                        </div>
                        {selectedTopics.length === 0 ? (
                            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{t('admin.booksFormTopicsEmpty')}</p>
                        ) : (
                            <div className="grid gap-2">
                                {selectedTopics.map((topic) => (
                                    <div key={topic.id} className="rounded-md border border-dashed p-3">
                                        <p className="text-sm font-medium">{topic.titleUk}</p>
                                        <p className="text-xs text-muted-foreground">{topic.titleEn}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
