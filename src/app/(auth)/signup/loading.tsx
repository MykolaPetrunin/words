import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormFieldSkeleton } from '@/components/ui/form-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function SignupLoading(): React.ReactElement {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Skeleton className="h-7 w-36" />
                    <Skeleton className="h-4 w-52" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mb-4" />

                    <div className="my-4 flex items-center">
                        <Skeleton className="h-px flex-1" />
                        <Skeleton className="h-4 w-8 mx-2" />
                        <Skeleton className="h-px flex-1" />
                    </div>

                    <div className="space-y-4">
                        <FormFieldSkeleton labelWidth="w-12" />
                        <FormFieldSkeleton labelWidth="w-16" />
                        <FormFieldSkeleton labelWidth="w-24" />
                        <Skeleton className="h-9 w-full" />
                    </div>

                    <div className="mt-4 text-center">
                        <Skeleton className="h-4 w-44 mx-auto" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
