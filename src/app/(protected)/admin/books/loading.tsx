import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBooksLoading(): React.ReactElement {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-60" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-4 rounded-lg border p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, badgeIndex) => (
                                <Skeleton key={badgeIndex} className="h-6 w-24" />
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
