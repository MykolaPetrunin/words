'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

import SubjectForm from '../components/SubjectForm';
import { updateAdminSubject } from '../actions';
import { mapSubjectToFormData } from '../utils';

interface SubjectDetailPageClientProps {
    subject: DbSubject;
}

export default function SubjectDetailPageClient({ subject }: SubjectDetailPageClientProps): React.ReactElement {
    const t = useI18n();
    const router = useRouter();
    const [currentSubject, setCurrentSubject] = useState<DbSubject>(subject);

    const copy = useMemo(
        () => ({
            title: t('admin.subjectsDetailTitle'),
            subtitle: t('admin.subjectsDetailSubtitle'),
            submit: t('admin.subjectsDetailSubmit'),
            success: t('admin.subjectsDetailSuccess'),
            error: t('admin.subjectsDetailError')
        }),
        [t]
    );

    const handleCancel = useCallback(() => {
        router.push(appPaths.adminSubjects);
    }, [router]);

    const handleSuccess = useCallback((updated: DbSubject) => {
        setCurrentSubject(updated);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{copy.title}</h1>
                        <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">{currentSubject.nameUk}</p>
                        <p>{currentSubject.nameEn}</p>
                    </div>
                </div>
                <span
                    className={
                        currentSubject.isActive
                            ? 'inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'
                            : 'inline-flex items-center justify-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700'
                    }
                >
                    {currentSubject.isActive ? t('admin.subjectsStatusActive') : t('admin.subjectsStatusInactive')}
                </span>
            </div>
            <SubjectForm
                subjectId={currentSubject.id}
                initialValues={mapSubjectToFormData(currentSubject)}
                submitLabel={copy.submit}
                successMessage={copy.success}
                errorMessage={copy.error}
                onSubmitAction={(values) => updateAdminSubject(currentSubject.id, values)}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}
