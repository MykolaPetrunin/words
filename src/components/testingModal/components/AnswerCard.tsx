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

    const appearance = useMemo(() => {
        if (!answered) {
            return selected
                ? {
                      container: 'bg-primary/15 border-primary text-neutral-900 dark:text-neutral-900',
                      prose: 'text-neutral-900 dark:text-neutral-900',
                      code: 'text-neutral-900 dark:text-neutral-900 bg-primary/25'
                  }
                : {
                      container: 'bg-background/95 dark:bg-background/80 hover:bg-accent border-border',
                      prose: 'text-foreground',
                      code: 'text-foreground bg-muted/30'
                  };
        }

        if (selected && answer.isCorrect) {
            return { container: 'bg-emerald-500 text-emerald-950 border-emerald-500', prose: 'text-emerald-950', code: 'text-emerald-950 bg-white/40' };
        }

        if ((selected && !answer.isCorrect) || (!selected && answer.isCorrect)) {
            return { container: 'bg-red-500 text-red-50 border-red-500', prose: 'text-red-50', code: 'text-red-50 bg-white/20' };
        }

        return { container: 'bg-background/95 dark:bg-background/80 border-border', prose: 'text-foreground', code: 'text-foreground bg-muted/30' };
    }, [answered, selected, answer]);

    return (
        <Card
            className={cn('cursor-pointer border transition-colors', appearance.container)}
            onClick={() => !answered && onToggle(answer.id)}
            role="button"
            aria-pressed={selected}
        >
            <CardContent className="p-4 flex justify-between items-center gap-3">
                <Prose
                    colorStyles={cn(appearance.prose, {
                        'prose-code:bg-transparent prose-code:text-inherit prose-pre:bg-transparent prose-pre:text-inherit': answered
                    })}
                    className={cn('text-sm leading-5')}
                    codeClassName={appearance.code}
                    isMD
                >
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
