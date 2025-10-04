'use client';

import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface QuestionsSkeletonProps {
    count: number;
}

export default function QuestionsSkeleton({ count }: QuestionsSkeletonProps): React.ReactElement {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="border">
                    <CardHeader className="space-y-3">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-9 w-40" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
