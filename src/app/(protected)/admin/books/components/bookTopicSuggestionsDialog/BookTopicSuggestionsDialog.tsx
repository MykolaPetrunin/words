'use client';

import { Loader2, Sparkles } from 'lucide-react';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import type { I18nKey } from '@/lib/i18n/types';
import { clientLogger } from '@/lib/logger';
import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';

import {
    generateAdminBookTopicSuggestions,
    type TopicSuggestionErrorCode,
    type TopicSuggestionExisting,
    type TopicSuggestionNew,
    type TopicSuggestionPriority,
    type TopicSuggestionStatus,
    type TopicSuggestions
} from '../../actions';

interface BookTopicSuggestionsDialogProps {
    book: DbBookWithRelations;
    onApply: (result: { existingTopics: TopicSuggestionExisting[]; newTopics: TopicSuggestionNew[] }) => Promise<void>;
}

const getNewTopicKey = (topic: TopicSuggestionNew): string => `${topic.titleUk.toLowerCase()}|${topic.titleEn.toLowerCase()}`;

const suggestionErrorMessageMap: Record<TopicSuggestionErrorCode, I18nKey> = {
    openai_api_key_missing: 'admin.booksTopicsSuggestMissingKey',
    book_not_found: 'admin.booksTopicsSuggestBookMissing',
    request_failed: 'admin.booksTopicsSuggestNetworkError',
    empty_response: 'admin.booksTopicsSuggestEmptyResponse',
    invalid_response: 'admin.booksTopicsSuggestInvalidResponse',
    quota_exceeded: 'admin.booksTopicsSuggestQuotaError',
    response_truncated: 'admin.booksTopicsSuggestTruncated'
} as const;

const priorityLabelMap: Record<TopicSuggestionPriority, I18nKey> = {
    strong: 'admin.booksTopicsSuggestPriorityStrong',
    optional: 'admin.booksTopicsSuggestPriorityOptional'
} as const;

export default function BookTopicSuggestionsDialog({ book, onApply }: BookTopicSuggestionsDialogProps): React.ReactElement {
    const t = useI18n();
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<TopicSuggestions | null>(null);
    const [selectedNewKeys, setSelectedNewKeys] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();
    const [isApplying, setIsApplying] = useState(false);
    const [errorKey, setErrorKey] = useState<I18nKey | null>(null);

    const renderPriorityBadge = useCallback(
        (priority: TopicSuggestionPriority) => {
            const label = t(priorityLabelMap[priority]);
            const base = 'rounded-full border px-2 py-0.5 text-xs font-medium';
            const classes =
                priority === 'strong' ? `${base} border-primary/40 bg-primary/10 text-primary` : `${base} border-muted-foreground/30 bg-muted/30 text-muted-foreground`;
            return <span className={classes}>{label}</span>;
        },
        [t]
    );

    const loadSuggestions = useCallback(() => {
        startTransition(async () => {
            try {
                const result = await generateAdminBookTopicSuggestions(book.id);
                if (!result.success) {
                    const fallbackKey: I18nKey = 'admin.booksTopicsSuggestError';
                    const messageKey = suggestionErrorMessageMap[result.code] ?? fallbackKey;
                    clientLogger.error('Topic suggestion failed', undefined, {
                        bookId: book.id,
                        code: result.code,
                        details: result.details
                    });
                    toast.error(t(messageKey));
                    setErrorKey(messageKey);
                    setSuggestions(null);
                    return;
                }

                const data = result.data;
                setSuggestions(data);
                setErrorKey(null);
                const strongDefaults = data.newTopics.filter((topic) => topic.priority === 'strong');
                const newSelection = new Set(strongDefaults.map((topic) => getNewTopicKey(topic)));
                setSelectedNewKeys(newSelection);
                if (data.status === 'covered') {
                    toast.info(t('admin.booksTopicsSuggestCoveredToast'));
                }
            } catch (error) {
                clientLogger.error('Topic suggestion failed', error as Error, { bookId: book.id });
                toast.error(t('admin.booksTopicsSuggestError'));
                setErrorKey('admin.booksTopicsSuggestError');
                setSuggestions(null);
            }
        });
    }, [book.id, t]);

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            setOpen(nextOpen);
            if (nextOpen) {
                setSuggestions(null);
                setSelectedNewKeys(new Set());
                setErrorKey(null);
                loadSuggestions();
            }
        },
        [loadSuggestions]
    );

    const existingSuggestions = useMemo(() => suggestions?.existingTopics ?? [], [suggestions]);
    const newSuggestions = useMemo(() => suggestions?.newTopics ?? [], [suggestions]);
    const suggestionStatus: TopicSuggestionStatus = suggestions?.status ?? 'needs_topics';
    const isCovered = suggestionStatus === 'covered';
    const applyDisabled = isPending || isApplying || !suggestions || errorKey !== null || (!isCovered && selectedNewKeys.size === 0);
    const applyLabelKey: I18nKey = isCovered ? 'admin.booksTopicsSuggestClose' : 'admin.booksTopicsSuggestApply';
    const applyLabel = t(applyLabelKey);

    const toggleNew = useCallback((key: string) => {
        setSelectedNewKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }, []);

    const handleApply = useCallback(() => {
        if (!suggestions) {
            return;
        }
        const pickedNew = suggestions.newTopics.filter((topic) => selectedNewKeys.has(getNewTopicKey(topic)));
        if (suggestions.status === 'covered') {
            setOpen(false);
            return;
        }
        if (pickedNew.length === 0) {
            toast.error(t('admin.booksTopicsSuggestEmptySelection'));
            return;
        }
        setIsApplying(true);
        const payload = { existingTopics: suggestions.existingTopics, newTopics: pickedNew };
        void (async () => {
            try {
                await onApply(payload);
                toast.success(t('admin.booksTopicsSuggestSuccess'));
                setOpen(false);
            } catch (error) {
                clientLogger.error('Topic suggestion apply failed', error as Error, { bookId: book.id });
                toast.error(t('admin.booksTopicsSuggestError'));
            } finally {
                setIsApplying(false);
            }
        })();
    }, [book.id, onApply, selectedNewKeys, suggestions, t]);

    return (
        <>
            <Button type="button" variant="outline" size="sm" onClick={() => handleOpenChange(true)} disabled={isPending} className="inline-flex items-center gap-2">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {t('admin.booksTopicsSuggestButton')}
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-h-[80vh] w-[80vw] overflow-y-auto max-w-[1024px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            {t('admin.booksTopicsSuggestTitle')}
                        </DialogTitle>
                        <DialogDescription>{t('admin.booksTopicsSuggestDescription')}</DialogDescription>
                    </DialogHeader>
                    {isPending && (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                    {!isPending && (
                        <div className="space-y-6">
                            {errorKey && <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{t(errorKey)}</div>}
                            {suggestions && (
                                <>
                                    {isCovered && (
                                        <div className="rounded-md border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
                                            {t('admin.booksTopicsSuggestStatusCovered')}
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold">{t('admin.booksTopicsSuggestExistingHeading')}</h3>
                                        {existingSuggestions.length === 0 ? (
                                            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                                {t('admin.booksTopicsSuggestExistingEmpty')}
                                            </p>
                                        ) : (
                                            <div className="grid gap-3">
                                                {existingSuggestions.map((topic) => (
                                                    <div key={topic.id} className="flex flex-col gap-1 rounded-md border p-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div>
                                                                <p className="text-sm font-medium">{topic.titleUk}</p>
                                                                <p className="text-xs text-muted-foreground">{topic.titleEn}</p>
                                                            </div>
                                                            {renderPriorityBadge(topic.priority)}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{topic.reason}</p>
                                                        <p className="text-xs text-primary">{t('admin.booksTopicsSuggestAlreadyAdded')}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold">{t('admin.booksTopicsSuggestNewHeading')}</h3>
                                        {newSuggestions.length === 0 ? (
                                            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{t('admin.booksTopicsSuggestNewEmpty')}</p>
                                        ) : (
                                            <div className="grid gap-3">
                                                {newSuggestions.map((topic) => {
                                                    const key = getNewTopicKey(topic);
                                                    const checked = selectedNewKeys.has(key);
                                                    return (
                                                        <label key={key} className="flex flex-col gap-1 rounded-md border p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div>
                                                                    <p className="text-sm font-medium">{topic.titleUk}</p>
                                                                    <p className="text-xs text-muted-foreground">{topic.titleEn}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {renderPriorityBadge(topic.priority)}
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={() => toggleNew(key)}
                                                                        className="h-4 w-4 rounded border border-input"
                                                                        disabled={isCovered}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{topic.reason}</p>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="button" onClick={handleApply} disabled={applyDisabled} className="inline-flex items-center gap-2">
                            {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
                            {applyLabel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
