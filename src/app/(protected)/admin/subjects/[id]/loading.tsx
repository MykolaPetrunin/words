import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSubjectDetailLoading(): React.ReactElement {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}
