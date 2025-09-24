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
    const locale: UserLocale = user?.locale === 'en' ? 'en' : 'uk';

    return (
        <div className="p-6">
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-3">{t('dashboard.subjects')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {subjects.map((s: DbSubject) => (
                            <SubjectTile key={s.id} id={s.id} name={locale === 'uk' ? s.nameUk : s.nameEn} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
