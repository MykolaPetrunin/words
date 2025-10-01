'use client';

import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/useI18n';

interface QuestionsListSkeletonProps {
    questionsCount?: number;
}

export default function QuestionsListSkeleton({ questionsCount = 5 }: QuestionsListSkeletonProps): React.ReactElement {
    const t = useI18n();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('books.questionsList')}</h2>
            <div className="space-y-2">
                {Array.from({ length: questionsCount }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                            <Skeleton className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
