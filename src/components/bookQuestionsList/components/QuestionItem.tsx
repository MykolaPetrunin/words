'use client';

import React from 'react';

import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

    const score = question.userScore ?? 0;
    const progressPercentage = Math.min((score / 5) * 100, 100);

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
                <div className="w-32 flex flex-col items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative w-full">
                                <Progress value={progressPercentage} className="h-6" />
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">{Math.round(progressPercentage)}%</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('books.questionProgress')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
