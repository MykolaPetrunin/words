'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';

export default function AdminPageClient(): React.ReactElement {
    const t = useI18n();

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{t('admin.description')}</p>
                </CardContent>
            </Card>
        </div>
    );
}
