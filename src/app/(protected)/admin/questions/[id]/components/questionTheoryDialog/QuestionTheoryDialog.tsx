'use client';

import { intervalToDuration } from 'date-fns';
import { Check, Loader2, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Prose } from '@/components/prose/Prose';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import { QuestionTheorySuggestion } from '@/lib/aiActions/getQuestionTheorySuggestions';
import type { I18nKey } from '@/lib/i18n/types';
import { clientLogger } from '@/lib/logger';
import type { QuestionDetail } from '@/lib/repositories/questionRepository';
import { cn } from '@/lib/utils';

import { applyAdminQuestionTheory, generateAdminQuestionTheory, type QuestionTheorySuggestionErrorCode } from './actions';

interface QuestionTheoryDialogProps {
    questionId: string;
    questionTextUk: string;
    questionTextEn: string;
    hasAnswers: boolean;
    onApplied: (question: QuestionDetail) => Promise<void>;
}

type TheoryTab = 'uk' | 'en';

const theoryTabs: readonly TheoryTab[] = ['uk', 'en'] as const;

const formatElapsedTime = (durationMs: number): string => {
    const duration = intervalToDuration({ start: 0, end: durationMs });
    const totalHours = (duration.days ?? 0) * 24 + (duration.hours ?? 0);
    const minutes = duration.minutes ?? 0;
    const seconds = duration.seconds ?? 0;
    const parts = totalHours > 0 ? [totalHours, minutes, seconds] : [minutes, seconds];
    return parts.map((value, index) => (index === 0 ? `${value}` : value.toString().padStart(2, '0'))).join(':');
};

const suggestionErrorMessageMap: Record<QuestionTheorySuggestionErrorCode, I18nKey> = {
    openai_api_key_missing: 'admin.questionsTheoryAiMissingKey',
    prompt_missing: 'admin.questionsTheoryAiMissingPrompt',
    question_not_found: 'admin.questionsTheoryAiMissingQuestion',
    answers_missing: 'admin.questionsTheoryAiMissingAnswers',
    answers_mismatch: 'admin.questionsTheoryAiMismatch',
    request_failed: 'admin.questionsTheoryAiError',
    empty_response: 'admin.questionsTheoryAiEmpty'
} as const;

export default function QuestionTheoryDialog({
    questionId,
    questionTextUk,
    questionTextEn,
    hasAnswers,
    onApplied
}: QuestionTheoryDialogProps): React.ReactElement | null {
    const t = useI18n();
    const [open, setOpen] = useState(false);
    const [suggestion, setSuggestion] = useState<QuestionTheorySuggestion | null>(null);
    const [errorKey, setErrorKey] = useState<I18nKey | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [requestStartedAt, setRequestStartedAt] = useState<number | null>(null);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TheoryTab>('uk');
    const [isPending, startTransition] = useTransition();

    const timerLabel = useMemo(() => {
        if (requestStartedAt !== null) {
            return t('admin.questionsTheoryAiTimerPending', { time: formatElapsedTime(elapsedMs) });
        }
        if (lastDurationMs !== null) {
            return t('admin.questionsTheoryAiTimerDone', { time: formatElapsedTime(lastDurationMs) });
        }
        return null;
    }, [elapsedMs, lastDurationMs, requestStartedAt, t]);

    const loadSuggestion = useCallback(() => {
        const startedAt = Date.now();
        setRequestStartedAt(startedAt);
        setElapsedMs(0);
        setLastDurationMs(null);
        startTransition(async () => {
            try {
                const result = await generateAdminQuestionTheory(questionId);
                if (!result.success) {
                    const key = suggestionErrorMessageMap[result.code] ?? 'admin.questionsTheoryAiError';
                    toast.error(t(key));
                    setErrorKey(key);
                    setSuggestion(null);
                    return;
                }
                setSuggestion(result.data.suggestion);
                setErrorKey(null);
                setActiveTab('uk');
            } catch (error) {
                clientLogger.error('Question theory suggestions failed', error as Error, { questionId });
                const fallback: I18nKey = 'admin.questionsTheoryAiError';
                toast.error(t(fallback));
                setErrorKey(fallback);
                setSuggestion(null);
            } finally {
                const duration = Date.now() - startedAt;
                setElapsedMs(duration);
                setLastDurationMs(duration);
                setRequestStartedAt(null);
            }
        });
    }, [questionId, t]);

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            setOpen(nextOpen);
            if (nextOpen) {
                setSuggestion(null);
                setErrorKey(null);
                setActiveTab('uk');
                loadSuggestion();
            } else {
                setRequestStartedAt(null);
                setElapsedMs(0);
                setLastDurationMs(null);
            }
        },
        [loadSuggestion]
    );

    const handleApprove = useCallback(() => {
        if (!suggestion) {
            toast.error(t('admin.questionsTheoryAiEmpty'));
            return;
        }
        setIsApplying(true);
        void (async () => {
            try {
                const updated = await applyAdminQuestionTheory(questionId, suggestion);
                await onApplied(updated);
                toast.success(t('admin.questionsTheoryAiApplySuccess'));
                setOpen(false);
            } catch (error) {
                clientLogger.error('Question theory suggestions apply failed', error as Error, { questionId });
                toast.error(t('admin.questionsTheoryAiApplyError'));
            } finally {
                setIsApplying(false);
            }
        })();
    }, [onApplied, questionId, suggestion, t]);

    useEffect(() => {
        if (!requestStartedAt || !isPending) {
            return;
        }
        setElapsedMs(Date.now() - requestStartedAt);
        const interval = window.setInterval(() => {
            setElapsedMs(Date.now() - requestStartedAt);
        }, 250);
        return () => {
            window.clearInterval(interval);
        };
    }, [isPending, requestStartedAt]);

    if (!hasAnswers) {
        return null;
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(true)}
                disabled={isPending || isApplying}
                className="inline-flex items-center gap-2"
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {t('admin.questionsTheoryAiButton')}
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-h-[80vh] w-[80vw] max-w-[720px] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            {t('admin.questionsTheoryAiTitle')}
                        </DialogTitle>
                        <DialogDescription>{t('admin.questionsTheoryAiDescription')}</DialogDescription>
                    </DialogHeader>
                    {timerLabel && <div className="flex justify-end text-xs text-muted-foreground">{timerLabel}</div>}
                    <div className="space-y-4">
                        <div className="space-y-2 rounded-md border bg-muted/40 p-3">
                            <p className="text-xs font-medium uppercase text-muted-foreground">{t('admin.questionsTheoryAiQuestionHeading')}</p>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">{questionTextUk}</p>
                                <p className="text-xs text-muted-foreground">{questionTextEn}</p>
                            </div>
                        </div>
                        {isPending ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {errorKey && <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{t(errorKey)}</div>}
                                {suggestion && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="inline-flex items-center gap-1 rounded-md border bg-muted/60 p-1">
                                                {theoryTabs.map((tab) => (
                                                    <button
                                                        key={tab}
                                                        type="button"
                                                        onClick={() => setActiveTab(tab)}
                                                        className={cn(
                                                            'rounded-sm px-3 py-1 text-xs font-medium transition-colors',
                                                            activeTab === tab
                                                                ? 'bg-primary text-primary-foreground shadow-xs'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        )}
                                                    >
                                                        {t(tab === 'uk' ? 'admin.questionsTheoryAiTabUk' : 'admin.questionsTheoryAiTabEn')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="max-h-[360px] space-y-4 overflow-y-auto rounded-md border p-4">
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium uppercase text-muted-foreground">{t('admin.questionsTheoryAiTheoryHeading')}</p>
                                                <Prose isMD className="text-sm leading-6 text-foreground">
                                                    {activeTab === 'uk' ? suggestion.theoryUk : suggestion.theoryEn}
                                                </Prose>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-xs font-medium uppercase text-muted-foreground">{t('admin.questionsTheoryAiAnswersHeading')}</p>
                                                {suggestion.answers.map((answerTheory, index) => (
                                                    <div key={`${answerTheory.theoryUk}-${index}`} className="space-y-2 rounded-md border bg-muted/30 p-3">
                                                        <span className="text-xs font-medium uppercase text-muted-foreground">
                                                            {t('admin.questionsTheoryAiAnswerLabel', { index: index + 1 })}
                                                        </span>
                                                        <Prose isMD className="text-sm leading-6 text-foreground">
                                                            {activeTab === 'uk' ? answerTheory.theoryUk : answerTheory.theoryEn}
                                                        </Prose>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!suggestion && !errorKey && (
                                    <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{t('admin.questionsTheoryAiEmpty')}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isApplying}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="button" onClick={handleApprove} disabled={isPending || isApplying || !suggestion} className="inline-flex items-center gap-2">
                            {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            {t('admin.questionsTheoryAiApprove')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
