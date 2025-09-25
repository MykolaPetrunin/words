'use client';
import { BookOpen } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/hooks/useI18n';
import type { PublicAnswer } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';
import { cn } from '@/lib/utils';

interface AnswerCardProps {
    answer: PublicAnswer;
    locale: UserLocale;
    selected: boolean;
    onToggle: (id: string) => void;
    showTheory: (theory: string) => void;
}

export default function AnswerCard({ answer, selected, onToggle, showTheory, locale }: AnswerCardProps): React.ReactElement {
    const t = useI18n();
    const text = locale === 'uk' ? answer.textUk : answer.textEn;
    const theory = locale === 'uk' ? answer.theoryUk : answer.theoryEn;

    return (
        <Card
            className={cn('cursor-pointer border transition-colors', selected ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent')}
            onClick={() => onToggle(answer.id)}
        >
            <CardContent className="p-4 flex justify-between items-center">
                <p className="text-sm leading-5">{text}</p>
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
            </CardContent>
        </Card>
    );
}
