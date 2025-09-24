import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading(): React.ReactElement {
    return (
        <div className="p-6">
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-7 w-48 mb-3" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }, (_, i) => (
                            <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
