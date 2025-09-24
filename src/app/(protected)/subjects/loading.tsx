import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function SubjectsLoading(): React.ReactElement {
    return (
        <div className="p-6">
            <div className="mb-6">
                <Skeleton className="h-8 w-48" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[2/3] rounded-lg" />
                ))}
            </div>
        </div>
    );
}
