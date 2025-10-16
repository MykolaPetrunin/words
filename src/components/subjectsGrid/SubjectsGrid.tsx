'use client';

import React from 'react';

import type { SubjectsGridProps } from '@/components/subjectsGrid/types';
import { useI18n } from '@/hooks/useI18n';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { DbSubject } from '@/lib/repositories/subjectRepository';
import type { UserLocale } from '@/lib/types/user';

import SubjectTile from './components/SubjectTile';

export default function SubjectsGrid({ subjects }: SubjectsGridProps): React.ReactElement {
    const t = useI18n();
    const user = useAppSelector((s) => s.currentUser.user);

    const locale: UserLocale = user?.locale ?? 'en';

    return (
        <div className="p-6">
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-3">{t('dashboard.subjects')}</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {subjects.map((s: DbSubject) => (
                            <div key={s.id} className="flex-shrink-0">
                                <SubjectTile id={s.id} name={locale === 'uk' ? s.nameUk : s.nameEn} coverUrl={s.coverUrl} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
