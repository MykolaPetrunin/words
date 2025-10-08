'use client';

import { BookOpenIcon, PlayIcon, XCircleIcon } from 'lucide-react';
import React, { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

interface BookActionsProps {
    isLearning: boolean;
    onStartLearning: () => Promise<void>;
    onStopLearning: () => Promise<void>;
    onStartTesting: () => void;
    className?: string;
}

export default function BookActions({ isLearning, onStartLearning, onStopLearning, onStartTesting, className }: BookActionsProps): React.ReactElement {
    const [isPending, startTransition] = useTransition();
    const t = useI18n();

    const handleLearningClick = (): void => {
        startTransition(async () => {
            if (isLearning) {
                await onStopLearning();
            } else {
                await onStartLearning();
            }
        });
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button onClick={handleLearningClick} variant={isLearning ? 'destructive' : 'default'} disabled={isPending} className="gap-2">
                {isPending ? (
                    <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {isLearning ? t('books.stopping') : t('books.starting')}
                    </>
                ) : isLearning ? (
                    <>
                        <XCircleIcon className="h-4 w-4" />
                        {t('books.stopLearning')}
                    </>
                ) : (
                    <>
                        <BookOpenIcon className="h-4 w-4" />
                        {t('books.startLearning')}
                    </>
                )}
            </Button>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={onStartTesting} variant="outline" disabled={!isLearning} className={cn('gap-2', !isLearning && 'opacity-50 cursor-not-allowed')}>
                            <PlayIcon className="h-4 w-4" />
                            {t('books.startTesting')}
                        </Button>
                    </TooltipTrigger>
                    {!isLearning && (
                        <TooltipContent>
                            <p>{t('books.needToLearnFirst')}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
