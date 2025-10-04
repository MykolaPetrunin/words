import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading(): React.ReactElement {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3 rounded-lg border p-6">
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-9 w-40" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
