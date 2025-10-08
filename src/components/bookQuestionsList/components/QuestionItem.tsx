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
            <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                    <span className="text-sm text-muted-foreground font-medium">{index + 1}.</span>
                    <div className="flex-1">
                        <Prose isMD className="text-sm">
                            {questionText}
                        </Prose>
                        <span className="text-xs text-muted-foreground mt-1 inline-block">
                            {t('books.level')}: {levelName}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
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
                        {theory && (
                            <div className="w-full flex justify-end">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {theory && <TheoryModal isOpen={isTheoryModalOpen} onClose={() => setIsTheoryModalOpen(false)} theory={theory} questionText={questionText} />}
        </>
    );
}
