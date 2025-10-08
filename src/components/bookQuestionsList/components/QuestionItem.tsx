'use client';

import { BookOpen } from 'lucide-react';
import React, { useState } from 'react';

import TheoryModal from '@/components/theoryModal/TheoryModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/hooks/useI18n';
import type { DbBookWithQuestions } from '@/lib/repositories/bookRepository';
import type { UserLocale } from '@/lib/types/user';

import { Prose } from '../../prose/Prose';

interface QuestionItemProps {
    index: number;
    question: DbBookWithQuestions['questions'][number];
    locale: UserLocale;
}

export default function QuestionItem({ index, question, locale }: QuestionItemProps): React.ReactElement {
    const t = useI18n();
    const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);

    const questionText = locale === 'uk' ? question.textUk : question.textEn;
    const levelName = locale === 'uk' ? question.level.nameUk : question.level.nameEn;
    const theory = locale === 'uk' ? question.theoryUk : question.theoryEn;

    const score = question.userScore ?? 0;
    const progressPercentage = Math.min((score / 5) * 100, 100);

    return (
        <>
            <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex items-center gap-3 sm:hidden">
                        <div className="flex-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="relative w-full overflow-hidden rounded-md">
                                        <Progress value={progressPercentage} className="h-6" />
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">{Math.round(progressPercentage)}%</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('books.questionProgress')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {theory && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsTheoryModalOpen(true)}>
                                        <BookOpen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('books.viewTheory')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0">
                        <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
                        <div className="flex-1 space-y-2 min-w-0">
                            <Prose isMD className="w-full text-sm break-words [&_*]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto">
                                {questionText}
                            </Prose>
                            <span className="inline-block text-xs text-muted-foreground">
                                {t('books.level')}: {levelName}
                            </span>
                        </div>
                    </div>

                    <div className="hidden w-32 flex-shrink-0 flex-col gap-2 sm:flex">
                        <div className="flex flex-col items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="relative w-full overflow-hidden rounded-md">
                                        <Progress value={progressPercentage} className="h-6" />
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">{Math.round(progressPercentage)}%</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('books.questionProgress')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {theory && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="self-end h-8 w-8" onClick={() => setIsTheoryModalOpen(true)}>
                                        <BookOpen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('books.viewTheory')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            {theory && <TheoryModal isOpen={isTheoryModalOpen} onClose={() => setIsTheoryModalOpen(false)} theory={theory} questionText={questionText} />}
        </>
    );
}
