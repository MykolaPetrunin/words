'use client';

import React from 'react';

import { useI18n } from '@/hooks/useI18n';
import type { DbBookWithQuestions } from '@/lib/repositories/bookRepository';
import type { UserLocale } from '@/lib/types/user';

interface QuestionItemProps {
    index: number;
    question: DbBookWithQuestions['questions'][number];
    locale: UserLocale;
}

export default function QuestionItem({ index, question, locale }: QuestionItemProps): React.ReactElement {
    const t = useI18n();
    const questionText = locale === 'uk' ? question.textUk : question.textEn;
    const levelName = locale === 'uk' ? question.level.nameUk : question.level.nameEn;

    return (
        <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground font-medium">{index + 1}.</span>
                <div className="flex-1">
                    <p className="text-sm">{questionText}</p>
                    <span className="text-xs text-muted-foreground mt-1 inline-block">
                        {t('books.level')}: {levelName}
                    </span>
                </div>
            </div>
        </div>
    );
}
