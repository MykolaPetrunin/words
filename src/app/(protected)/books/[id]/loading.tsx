import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function BookLoadingSkeleton(): React.ReactElement {
    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
