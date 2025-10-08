import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSubjectsLoading(): React.ReactElement {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3 rounded-lg border p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
