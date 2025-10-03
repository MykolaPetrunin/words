import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading(): React.ReactElement {
    return (
        <div className="p-6 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
            </div>
        </div>
    );
}
