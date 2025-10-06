'use client';
import { BookOpen } from 'lucide-react';
import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/hooks/useI18n';
import type { PublicAnswer } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';
import { cn } from '@/lib/utils';

import { Prose } from '../../prose/Prose';

interface AnswerCardProps {
    answer: PublicAnswer;
    locale: UserLocale;
    selected: boolean;
    onToggle: (id: string) => void;
    showTheory: (theory: string) => void;
    answered: boolean;
}

export default function AnswerCard({ answer, selected, onToggle, showTheory, locale, answered }: AnswerCardProps): React.ReactElement {
    const t = useI18n();
    const text = locale === 'uk' ? answer.textUk : answer.textEn;
    const theory = locale === 'uk' ? answer.theoryUk : answer.theoryEn;

    const colorStyle = useMemo(() => {
        if (!answered) return selected ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent';

        if (selected && answer.isCorrect) return 'bg-green-500 text-white';

        if ((selected && !answer.isCorrect) || (!selected && answer.isCorrect)) return 'bg-red-500 text-white';

        return '';
    }, [answered, selected, answer]);

    return (
        <Card className={cn('cursor-pointer border transition-colors', colorStyle)} onClick={() => !answered && onToggle(answer.id)}>
            <CardContent className="p-4 flex justify-between items-center">
                <Prose className={cn('text-sm leading-5', colorStyle)} isMD>
                    {text}
                </Prose>

                {answered && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (theory) showTheory(theory);
                                }}
                            >
                                <BookOpen className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('testing.viewTheory')}</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </CardContent>
        </Card>
    );
}
