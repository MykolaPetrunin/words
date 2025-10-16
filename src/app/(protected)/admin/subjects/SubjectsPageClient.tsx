'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import { getAdminSubjectPath } from '@/lib/appPaths';
import type { DbSubject } from '@/lib/repositories/subjectRepository';

import SubjectForm from './components/SubjectForm';
import { createAdminSubject } from './actions';
import { emptySubjectFormData } from './utils';

interface SubjectsPageClientProps {
    initialSubjects: DbSubject[];
}

export default function SubjectsPageClient({ initialSubjects }: SubjectsPageClientProps): React.ReactElement {
    const t = useI18n();
    const [subjects, setSubjects] = useState<DbSubject[]>(() => initialSubjects);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const createCopy = useMemo(
        () => ({
            title: t('admin.subjectsCreateTitle'),
            description: t('admin.subjectsCreateDescription'),
            submit: t('admin.subjectsCreateSubmit'),
            success: t('admin.subjectsCreateSuccess'),
            error: t('admin.subjectsCreateError')
        }),
        [t]
    );

    const handleCreateSuccess = useCallback((subject: DbSubject) => {
        setSubjects((prev) => [...prev, subject]);
        setIsCreateOpen(false);
    }, []);

    const handleCreateClose = useCallback((open: boolean) => {
        if (!open) {
            setIsCreateOpen(false);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">{t('admin.subjectsTitle')}</h1>
                    <p className="text-sm text-muted-foreground">{t('admin.subjectsSubtitle')}</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={handleCreateClose}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateOpen(true)}>{t('admin.subjectsCreateButton')}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{createCopy.title}</DialogTitle>
                            <DialogDescription>{createCopy.description}</DialogDescription>
                        </DialogHeader>
                        <SubjectForm
                            initialValues={{ ...emptySubjectFormData }}
                            submitLabel={createCopy.submit}
                            successMessage={createCopy.success}
                            errorMessage={createCopy.error}
                            onSubmitAction={createAdminSubject}
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {subjects.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">{t('admin.subjectsEmpty')}</div>
            ) : (
                <div className="grid gap-4">
                    {subjects.map((subject) => (
                        <Link
                            key={subject.id}
                            href={getAdminSubjectPath(subject.id)}
                            className="block rounded-lg border p-4 shadow-xs transition hover:border-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="relative aspect-[2/3] w-24 overflow-hidden rounded-md border bg-muted sm:w-28">
                                    {subject.coverUrl ? (
                                        <NextImage src={subject.coverUrl} alt={subject.nameUk} fill sizes="112px" className="object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">{t('admin.subjectsCoverEmpty')}</div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold">{subject.nameUk}</p>
                                            <p className="text-sm text-muted-foreground">{subject.nameEn}</p>
                                        </div>
                                        <span
                                            className={
                                                subject.isActive
                                                    ? 'inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'
                                                    : 'inline-flex items-center justify-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700'
                                            }
                                        >
                                            {subject.isActive ? t('admin.subjectsStatusActive') : t('admin.subjectsStatusInactive')}
                                        </span>
                                    </div>
                                    {(subject.descriptionUk && subject.descriptionUk.length > 0) || (subject.descriptionEn && subject.descriptionEn.length > 0) ? (
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {subject.descriptionUk && subject.descriptionUk.length > 0 ? (
                                                <p className="text-sm leading-relaxed text-muted-foreground">{subject.descriptionUk}</p>
                                            ) : null}
                                            {subject.descriptionEn && subject.descriptionEn.length > 0 ? (
                                                <p className="text-sm leading-relaxed text-muted-foreground">{subject.descriptionEn}</p>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
