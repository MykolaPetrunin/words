import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading(): React.ReactElement {
    return (
        <div className="space-y-6 p-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-10 w-full lg:w-1/2" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-9 w-28" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="space-y-4 rounded-lg border border-dashed p-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-40" />
            </div>
        </div>
    );
}
