'use client';

import { intervalToDuration } from 'date-fns';
import { Loader2, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import type { QuestionAnswersSuggestion } from '@/lib/aiActions/getQusetionAnswersSuggestions';
import type { I18nKey } from '@/lib/i18n/types';
import { clientLogger } from '@/lib/logger';
import type { QuestionDetail } from '@/lib/repositories/questionRepository';

import { applyAdminQuestionAnswers, generateAdminQuestionAnswers, type QuestionAnswersSuggestionErrorCode } from './actions';

interface QuestionAnswersDialogProps {
    questionId: string;
    questionTextUk: string;
    questionTextEn: string;
    onApplied: (question: QuestionDetail) => Promise<void>;
}

const formatElapsedTime = (durationMs: number): string => {
    const duration = intervalToDuration({ start: 0, end: durationMs });
    const totalHours = (duration.days ?? 0) * 24 + (duration.hours ?? 0);
    const minutes = duration.minutes ?? 0;
    const seconds = duration.seconds ?? 0;
    const parts = totalHours > 0 ? [totalHours, minutes, seconds] : [minutes, seconds];
    return parts.map((value, index) => (index === 0 ? `${value}` : value.toString().padStart(2, '0'))).join(':');
};

const suggestionErrorMessageMap: Record<QuestionAnswersSuggestionErrorCode, I18nKey> = {
    openai_api_key_missing: 'admin.questionsAnswersAiMissingKey',
    prompt_missing: 'admin.questionsAnswersAiMissingPrompt',
    question_not_found: 'admin.questionsAnswersAiMissingQuestion',
    already_has_answers: 'admin.questionsAnswersAiHasAnswers',
    request_failed: 'admin.questionsAnswersAiError',
    empty_response: 'admin.questionsAnswersAiEmpty'
} as const;

export default function QuestionAnswersDialog({ questionId, questionTextUk, questionTextEn, onApplied }: QuestionAnswersDialogProps): React.ReactElement {
    const t = useI18n();
    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState<readonly QuestionAnswersSuggestion[] | null>(null);
    const [errorKey, setErrorKey] = useState<I18nKey | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [requestStartedAt, setRequestStartedAt] = useState<number | null>(null);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const timerLabel = useMemo(() => {
        if (requestStartedAt !== null) {
            return t('admin.questionsAnswersAiTimerPending', { time: formatElapsedTime(elapsedMs) });
        }
        if (lastDurationMs !== null) {
            return t('admin.questionsAnswersAiTimerDone', { time: formatElapsedTime(lastDurationMs) });
        }
        return null;
    }, [elapsedMs, lastDurationMs, requestStartedAt, t]);

    const loadSuggestions = useCallback(() => {
        const startedAt = Date.now();
        setRequestStartedAt(startedAt);
        setElapsedMs(0);
        setLastDurationMs(null);
        startTransition(async () => {
            try {
                const result = await generateAdminQuestionAnswers(questionId);
                if (!result.success) {
                    const key = suggestionErrorMessageMap[result.code] ?? 'admin.questionsAnswersAiError';
                    toast.error(t(key));
                    setErrorKey(key);
                    setAnswers(null);
                    return;
                }
                setAnswers(result.data.answers);
                setErrorKey(null);
            } catch (error) {
                clientLogger.error('Question answer suggestions failed', error as Error, { questionId });
                const fallback: I18nKey = 'admin.questionsAnswersAiError';
                toast.error(t(fallback));
                setErrorKey(fallback);
                setAnswers(null);
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
                setAnswers(null);
                setErrorKey(null);
                loadSuggestions();
            } else {
                setRequestStartedAt(null);
                setElapsedMs(0);
                setLastDurationMs(null);
            }
        },
        [loadSuggestions]
    );

    const handleApply = useCallback(() => {
        if (!answers || answers.length === 0) {
            toast.error(t('admin.questionsAnswersAiEmpty'));
            return;
        }
        setIsApplying(true);
        void (async () => {
            try {
                const updated = await applyAdminQuestionAnswers(questionId, answers);
                await onApplied(updated);
                toast.success(t('admin.questionsAnswersAiApplySuccess'));
                setOpen(false);
            } catch (error) {
                clientLogger.error('Question answer suggestions apply failed', error as Error, { questionId });
                toast.error(t('admin.questionsAnswersAiApplyError'));
            } finally {
                setIsApplying(false);
            }
        })();
    }, [answers, onApplied, questionId, t]);

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
                {t('admin.questionsAnswersAiButton')}
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-h-[80vh] w-[80vw] max-w-[680px] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            {t('admin.questionsAnswersAiTitle')}
                        </DialogTitle>
                        <DialogDescription>{t('admin.questionsAnswersAiDescription')}</DialogDescription>
                    </DialogHeader>
                    {timerLabel && <div className="flex justify-end text-xs text-muted-foreground">{timerLabel}</div>}
                    <div className="space-y-4">
                        <div className="space-y-2 rounded-md border bg-muted/40 p-3">
                            <p className="text-xs font-medium uppercase text-muted-foreground">{t('admin.questionsAnswersAiQuestionHeading')}</p>
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
                                {answers && (
                                    <div className="space-y-3">
                                        {answers.map((answer, index) => (
                                            <div key={`${answer.textUk}-${index}`} className="space-y-2 rounded-md border p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">{t('admin.questionsAnswersAiAnswerLabel', { index: index + 1 })}</span>
                                                    <span
                                                        className={
                                                            answer.isCorrect
                                                                ? 'inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600'
                                                                : 'inline-flex items-center gap-1 rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600'
                                                        }
                                                    >
                                                        {answer.isCorrect ? (
                                                            <>
                                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                                {t('admin.questionsAnswersAiCorrect')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShieldAlert className="h-3.5 w-3.5" />
                                                                {t('admin.questionsAnswersAiIncorrect')}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold">{answer.textUk}</p>
                                                    <p className="text-xs text-muted-foreground">{answer.textEn}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!answers && !errorKey && (
                                    <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{t('admin.questionsAnswersAiEmpty')}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isApplying}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="button" onClick={handleApply} disabled={isPending || isApplying || !answers} className="inline-flex items-center gap-2">
                            {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t('admin.questionsAnswersAiApply')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
