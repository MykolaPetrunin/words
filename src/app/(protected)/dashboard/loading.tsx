import React from 'react';

import { CardSkeleton } from '@/components/ui/form-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading(): React.ReactElement {
    return (
        <div className="p-6">
            <div className="mb-6">
                <Skeleton className="h-8 w-48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSkeleton contentLines={2} />
                <CardSkeleton contentLines={2} />
                <CardSkeleton contentLines={2} />
            </div>

            <div className="mt-8">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
