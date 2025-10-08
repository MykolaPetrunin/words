import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBookDetailLoading(): React.ReactElement {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-60" />
                <Skeleton className="h-4 w-80" />
            </div>
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}
