'use client';

import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';

import { buttonVariants } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';

export default function AdminSubjectNotFound(): React.ReactElement {
    const t = useI18n();
    const backHref = appPaths.adminSubjects as Route;

    return (
        <div className="space-y-4 rounded-lg border border-dashed p-12 text-center">
            <h1 className="text-lg font-semibold">{t('admin.subjectsDetailNotFoundTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('admin.subjectsDetailNotFoundDescription')}</p>
            <div className="flex justify-center">
                <Link href={backHref} className={buttonVariants({ variant: 'outline' })}>
                    {t('admin.subjectsDetailNotFoundAction')}
                </Link>
            </div>
        </div>
    );
}
