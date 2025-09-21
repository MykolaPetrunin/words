import React from 'react';

import { FormFieldSkeleton } from '@/components/ui/form-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountLoading(): React.ReactElement {
    return (
        <div className="mx-auto w-full max-w-3xl p-6">
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-32" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormFieldSkeleton labelWidth="w-12" />
                    <FormFieldSkeleton labelWidth="w-20" />
                    <FormFieldSkeleton labelWidth="w-18" />
                    <FormFieldSkeleton labelWidth="w-32" />
                </div>

                <div className="flex gap-3">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>
        </div>
    );
}
