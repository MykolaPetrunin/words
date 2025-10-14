'use client';

import { intervalToDuration } from 'date-fns';
import { Loader2, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import type { I18nKey } from '@/lib/i18n/types';
import { clientLogger } from '@/lib/logger';

import { createTopicQuestionsFromSuggestions } from '../../actions';
import type { TopicSummary } from '../topicQuestionsPageClient/TopicQuestionsPageClient';
import { getTopicQuestionsSuggestions, type TopicQuestionSuggestion } from '../topicQuestionsPageClient/aiActions';

interface BookSummary {
    readonly id: string;
    readonly titleUk: string;
    readonly titleEn: string;
    readonly descriptionUk: string;
    readonly descriptionEn: string;
}

interface ExistingQuestionPayload {
    readonly textUk: string;
    readonly textEn: string;
}

interface OtherTopicPayload {
    readonly titleUk: string;
    readonly titleEn: string;
}

interface TopicQuestionSuggestionsDialogProps {
    readonly book: BookSummary;
    readonly topic: TopicSummary;
    readonly existingQuestions: readonly ExistingQuestionPayload[];
    readonly otherTopics: readonly OtherTopicPayload[];
    readonly onApplied: () => void;
}

interface SuggestionWithId extends TopicQuestionSuggestion {
    readonly id: string;
}

const formatElapsedTime = (durationMs: number): string => {
    const duration = intervalToDuration({ start: 0, end: durationMs });
    const totalHours = (duration.days ?? 0) * 24 + (duration.hours ?? 0);
    const minutes = duration.minutes ?? 0;
    const seconds = duration.seconds ?? 0;
    const parts = totalHours > 0 ? [totalHours, minutes, seconds] : [minutes, seconds];
    return parts.map((value, index) => (index === 0 ? `${value}` : value.toString().padStart(2, '0'))).join(':');
};

const generateSuggestionId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function TopicQuestionSuggestionsDialog({
    book,
    topic,
    existingQuestions,
    otherTopics,
    onApplied
}: TopicQuestionSuggestionsDialogProps): React.ReactElement {
    const t = useI18n();
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestionWithId[] | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isGenerating, startGenerating] = useTransition();
    const [isApplying, setIsApplying] = useState(false);
    const [errorKey, setErrorKey] = useState<I18nKey | null>(null);
    const [requestStartedAt, setRequestStartedAt] = useState<number | null>(null);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);

    const levelLabels = useMemo(
        () => ({
            junior: t('books.levelJunior'),
            middle: t('books.levelMiddle'),
            senior: t('books.levelSenior')
        }),
        [t]
    );

    const loadSuggestions = useCallback(() => {
        const startedAt = Date.now();
        setRequestStartedAt(startedAt);
        setElapsedMs(0);
        setLastDurationMs(null);
        startGenerating(async () => {
            try {
                const result = await getTopicQuestionsSuggestions({
                    topicTitleEn: topic.titleEn,
                    topicTitleUk: topic.titleUk,
                    bookTitleEn: book.titleEn,
                    bookTitleUk: book.titleUk,
                    bookDescriptionEn: book.descriptionEn,
                    bookDescriptionUk: book.descriptionUk,
                    existingQuestions: [...existingQuestions],
                    otherTopics: [...otherTopics]
                });

                if (!result || result.length === 0) {
                    toast.info(t('admin.booksTopicQuestionsAiEmpty'));
                    setSuggestions([]);
                    setSelectedIds(new Set());
                    setErrorKey('admin.booksTopicQuestionsAiEmpty');
                    return;
                }

                const items = result.map<SuggestionWithId>((item) => ({
                    ...item,
                    id: generateSuggestionId()
                }));

                setSuggestions(items);
                const requiredItems = items.filter((item) => !item.optional);
                const defaultSelection = requiredItems.length > 0 ? requiredItems : items;
                setSelectedIds(new Set(defaultSelection.map((item) => item.id)));
                setErrorKey(null);
            } catch (error) {
                clientLogger.error('Topic question suggestions failed', error as Error, { bookId: book.id, topicId: topic.id });
                toast.error(t('admin.booksTopicQuestionsAiError'));
                setSuggestions(null);
                setSelectedIds(new Set());
                setErrorKey('admin.booksTopicQuestionsAiError');
            } finally {
                const duration = Date.now() - startedAt;
                setElapsedMs(duration);
                setLastDurationMs(duration);
                setRequestStartedAt(null);
            }
        });
    }, [book.descriptionEn, book.descriptionUk, book.id, book.titleEn, book.titleUk, existingQuestions, otherTopics, t, topic.id, topic.titleEn, topic.titleUk]);

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            setOpen(nextOpen);
            if (nextOpen) {
                setSuggestions(null);
                setSelectedIds(new Set());
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

    useEffect(() => {
        if (!requestStartedAt || !isGenerating) {
            return;
        }
        setElapsedMs(Date.now() - requestStartedAt);
        const interval = window.setInterval(() => {
            setElapsedMs(Date.now() - requestStartedAt);
        }, 250);
        return () => {
            window.clearInterval(interval);
        };
    }, [isGenerating, requestStartedAt]);

    const timerLabel = useMemo(() => {
        if (requestStartedAt !== null) {
            return t('admin.booksTopicQuestionsAiTimerPending', { time: formatElapsedTime(elapsedMs) });
        }
        if (lastDurationMs !== null) {
            return t('admin.booksTopicQuestionsAiTimerDone', { time: formatElapsedTime(lastDurationMs) });
        }
        return null;
    }, [elapsedMs, lastDurationMs, requestStartedAt, t]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const applyDisabled = isGenerating || isApplying || !suggestions || selectedIds.size === 0 || errorKey === 'admin.booksTopicQuestionsAiError';

    const handleApply = useCallback(() => {
        if (!suggestions || selectedIds.size === 0) {
            toast.info(t('admin.booksTopicQuestionsAiSelectionEmpty'));
            return;
        }
        const selected = suggestions.filter((item) => selectedIds.has(item.id));
        if (selected.length === 0) {
            toast.info(t('admin.booksTopicQuestionsAiSelectionEmpty'));
            return;
        }
        setIsApplying(true);
        void (async () => {
            try {
                const created = await createTopicQuestionsFromSuggestions({
                    bookId: book.id,
                    topicId: topic.id,
                    suggestions: selected.map(({ id: _id, ...rest }) => rest)
                });
                if (created === 0) {
                    toast.info(t('admin.booksTopicQuestionsAiSelectionEmpty'));
                    return;
                }
                toast.success(t('admin.booksTopicQuestionsAiCreateSuccess'));
                setOpen(false);
                setSuggestions(null);
                setSelectedIds(new Set());
                onApplied();
            } catch (error) {
                clientLogger.error('Topic question creation failed', error as Error, { bookId: book.id, topicId: topic.id });
                toast.error(t('admin.booksTopicQuestionsAiCreateError'));
            } finally {
                setIsApplying(false);
            }
        })();
    }, [book.id, onApplied, selectedIds, suggestions, t, topic.id]);

    return (
        <>
            <Button type="button" className="inline-flex items-center gap-2" onClick={() => handleOpenChange(true)} disabled={isGenerating || isApplying}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {t('admin.booksTopicQuestionsAiButton')}
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="h-[80vh] w-[80vw] max-w-[1024px] overflow-hidden p-0">
                    <div className="flex h-full min-h-0 flex-col">
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                {t('admin.booksTopicQuestionsAiModalTitle')}
                            </DialogTitle>
                            <DialogDescription>{t('admin.booksTopicQuestionsAiModalDescription')}</DialogDescription>
                        </DialogHeader>
                        {timerLabel && <div className="flex justify-end px-6 text-xs text-muted-foreground">{timerLabel}</div>}
                        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
                            {isGenerating && (
                                <div className="flex h-full min-h-[200px] items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            )}
                            {!isGenerating && (
                                <div className="space-y-4">
                                    {errorKey === 'admin.booksTopicQuestionsAiError' && (
                                        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                                            {t('admin.booksTopicQuestionsAiError')}
                                        </div>
                                    )}
                                    {suggestions && suggestions.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {suggestions.map((item) => {
                                                const selected = selectedIds.has(item.id);
                                                const containerClass = selected
                                                    ? 'space-y-4 rounded-lg border border-primary bg-primary/5 p-4'
                                                    : 'space-y-4 rounded-lg border p-4';
                                                return (
                                                    <div key={item.id} className={containerClass}>
                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('books.level')}</p>
                                                                <p className="text-sm font-medium capitalize">{levelLabels[item.level]}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {item.optional ? (
                                                                    <span className="rounded-full border border-muted-foreground/30 bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                                        {t('admin.booksTopicQuestionsAiOptional')}
                                                                    </span>
                                                                ) : null}
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={selected ? 'default' : 'outline'}
                                                                    onClick={() => toggleSelection(item.id)}
                                                                    aria-pressed={selected}
                                                                >
                                                                    {selected ? t('questions.detailAiSelected') : t('questions.detailAiSelect')}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                                    {t('questions.detailTextUkLabel')}
                                                                </p>
                                                                <div className="whitespace-pre-wrap rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground">
                                                                    {item.textUk}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                                    {t('questions.detailTextEnLabel')}
                                                                </p>
                                                                <div className="whitespace-pre-wrap rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground">
                                                                    {item.textEn}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border bg-muted/50 p-6 text-sm text-muted-foreground">{t('admin.booksTopicQuestionsAiEmpty')}</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex items-center justify-between gap-3 border-t px-6 py-4">
                            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)} disabled={isApplying}>
                                {t('questions.detailAiDismiss')}
                            </Button>
                            <Button type="button" onClick={handleApply} disabled={applyDisabled}>
                                {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t('questions.detailAiApply')}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
