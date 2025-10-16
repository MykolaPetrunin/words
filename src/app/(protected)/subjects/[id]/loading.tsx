import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading(): React.ReactElement {
    return (
        <div className="p-6">
            <div className="space-y-8">
                <div>
                    <Skeleton className="mb-3 h-7 w-48" />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {Array.from({ length: 12 }, (_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border bg-muted">
                                    <Skeleton className="absolute inset-0" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
