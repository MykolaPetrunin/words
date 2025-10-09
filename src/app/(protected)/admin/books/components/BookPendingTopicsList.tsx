'use client';

import { X } from 'lucide-react';
import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

import type { TopicSuggestionNew } from '../actions';

interface BookPendingTopicsListProps {
    topics: readonly TopicSuggestionNew[];
    onRemove: (topic: TopicSuggestionNew) => void;
    disabled?: boolean;
}

export default function BookPendingTopicsList({ topics, onRemove, disabled = false }: BookPendingTopicsListProps): React.ReactElement | null {
    const t = useI18n();
    const priorityLabels = useMemo(
        () => ({
            strong: t('admin.booksTopicsSuggestPriorityStrong'),
            optional: t('admin.booksTopicsSuggestPriorityOptional')
        }),
        [t]
    );

    if (topics.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 rounded-lg border border-dashed p-4">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold">{t('admin.booksTopicsPendingHeading')}</h3>
                <p className="text-xs text-muted-foreground">{t('admin.booksTopicsPendingDescription')}</p>
            </div>
            <div className="grid gap-2">
                {topics.map((topic) => (
                    <div key={`${topic.titleUk}|${topic.titleEn}`} className="flex items-start justify-between gap-2 rounded-md border bg-muted/40 p-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{topic.titleUk}</p>
                                <span
                                    className={
                                        topic.priority === 'strong'
                                            ? 'rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'
                                            : 'rounded-full border border-muted-foreground/30 bg-muted/30 px-2 py-0.5 text-xs font-medium text-muted-foreground'
                                    }
                                >
                                    {priorityLabels[topic.priority]}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{topic.titleEn}</p>
                            <p className="text-xs text-muted-foreground">{topic.reason}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(topic)} disabled={disabled} className="h-7 w-7 text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">{t('admin.booksTopicsPendingRemove')}</span>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
