'use client';

import { AlertCircle, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import type { Control } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/hooks/useI18n';
import { getAdminBookTopicPath } from '@/lib/appPaths';
import type { DbTopicWithStats } from '@/lib/repositories/topicRepository';

import type { BookFormData } from '../schemas';

interface BookTopicsFieldProps {
    control: Control<BookFormData>;
    topics: readonly DbTopicWithStats[];
    actions?: React.ReactNode;
    onDeleteTopic?: (topic: DbTopicWithStats) => void;
    deleteDisabled?: boolean;
}

export default function BookTopicsField({ control, topics, actions, onDeleteTopic, deleteDisabled = false }: BookTopicsFieldProps): React.ReactElement {
    const t = useI18n();

    const getTopicStatusIcon = (topic: DbTopicWithStats) => {
        if (topic.totalQuestions === 0) {
            return {
                icon: AlertCircle,
                color: 'text-red-500',
                tooltip: t('admin.booksTopicNoQuestions')
            };
        }

        if (topic.previewQuestions > 0) {
            return {
                icon: Eye,
                color: 'text-yellow-500',
                tooltip: t('admin.booksTopicHasPreviewQuestions', { count: topic.previewQuestions })
            };
        }

        if (topic.inactiveQuestions > 0) {
            return {
                icon: AlertTriangle,
                color: 'text-orange-500',
                tooltip: t('admin.booksTopicHasInactiveQuestions', { count: topic.inactiveQuestions })
            };
        }

        return null;
    };

    return (
        <TooltipProvider>
            <FormField
                control={control}
                name="topicIds"
                render={({ field: _field }) => (
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
                                    const statusIcon = getTopicStatusIcon(topic);
                                    const StatusIcon = statusIcon?.icon;

                                    return (
                                        <div
                                            key={topic.id}
                                            className="flex items-start justify-between gap-3 rounded-md border border-dashed p-3 transition hover:border-primary/60"
                                        >
                                            <Link
                                                href={getAdminBookTopicPath(topic.bookId, topic.id)}
                                                className="flex-1 space-y-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{topic.titleUk}</p>
                                                    {statusIcon && StatusIcon && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <StatusIcon className={`h-4 w-4 ${statusIcon.color}`} />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{statusIcon.tooltip}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{topic.titleEn}</p>
                                            </Link>
                                            {onDeleteTopic && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDeleteTopic(topic)}
                                                    disabled={deleteDisabled}
                                                    className="h-8 w-8 text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">{t('admin.booksTopicsDeleteTrigger')}</span>
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </TooltipProvider>
    );
}
