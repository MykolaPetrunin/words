import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function SubjectsLoading(): React.ReactElement {
    return (
        <div className="p-6">
            <div className="mb-6">
                <Skeleton className="h-8 w-48" />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-[250px]">
                        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border bg-muted">
                            <Skeleton className="absolute inset-0" />
                        </div>
                        <Skeleton className="mt-2 h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );
}
