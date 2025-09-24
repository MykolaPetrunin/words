import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';

export default function SubjectNotFound(): React.ReactElement {
    const t = useI18n();

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl text-muted-foreground">{t('subjects.notFound')}</p>
                <Link href={appPaths.subjects}>
                    <Button variant="default">{t('subjects.backToList')}</Button>
                </Link>
            </div>
        </div>
    );
}
