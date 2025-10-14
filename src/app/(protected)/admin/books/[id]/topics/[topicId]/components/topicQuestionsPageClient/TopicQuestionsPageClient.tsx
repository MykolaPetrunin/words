'use client';

import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import { getAdminBookPath } from '@/lib/appPaths';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { LevelKey } from '@/lib/repositories/bookLevelProgress';
import type { QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import QuestionCard from '../../../../../../components/QuestionCard';
import { createTopicQuestionsFromSuggestions } from '../../actions';

import { getTopicQuestionsSuggestions, type TopicQuestionSuggestion } from './aiActions';

export interface TopicSummary {
    readonly id: string;
    readonly titleUk: string;
    readonly titleEn: string;
}

interface BookSummary {
    readonly id: string;
    readonly titleUk: string;
    readonly titleEn: string;
    readonly descriptionUk: string;
    readonly descriptionEn: string;
}

interface SuggestionItem extends TopicQuestionSuggestion {
    readonly id: string;
}

interface SuggestionDialogState {
    readonly items: readonly SuggestionItem[];
    readonly selections: Record<string, boolean>;
}

interface TopicQuestionsPageClientProps {
    readonly book: BookSummary;
    readonly topic: TopicSummary;
    readonly questions: readonly QuestionListItem[];
}

const generateSuggestionId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function TopicQuestionsPageClient({ book, topic, questions }: TopicQuestionsPageClientProps): React.ReactElement {
    const t = useI18n();
    const router = useRouter();
    const reduxUser = useAppSelector((state) => state.currentUser.user);
    const [isSuggestionsPending, startSuggestionsTransition] = useTransition();
    const [isApplyPending, startApplyTransition] = useTransition();
    const [dialogState, setDialogState] = useState<SuggestionDialogState | null>(null);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';

    const levelLabels = useMemo<Record<LevelKey, string>>(
        () => ({
            junior: t('books.levelJunior'),
            middle: t('books.levelMiddle'),
            senior: t('books.levelSenior')
        }),
        [t]
    );

    const existingQuestionsPayload = useMemo(
        () =>
            questions.map((question) => ({
                textUk: question.textUk,
                textEn: question.textEn
            })),
        [questions]
    );

    const bookTitle = locale === 'en' ? book.titleEn : book.titleUk;
    const topicTitle = locale === 'en' ? topic.titleEn : topic.titleUk;
    const subtitle = t('admin.booksTopicQuestionsSubtitle').replace('{book}', bookTitle).replace('{topic}', topicTitle);
    const suggestionsButtonDisabled = isSuggestionsPending || isApplyPending;
    const isDialogOpen = dialogState !== null;

    const handleCloseDialog = useCallback(() => {
        setDialogState(null);
    }, []);

    const handleGenerateSuggestions = useCallback(() => {
        startSuggestionsTransition(async () => {
            try {
                const suggestions = await getTopicQuestionsSuggestions({
                    topicTitleEn: topic.titleEn,
                    topicTitleUk: topic.titleUk,
                    bookTitleEn: book.titleEn,
                    bookTitleUk: book.titleUk,
                    bookDescriptionEn: book.descriptionEn,
                    bookDescriptionUk: book.descriptionUk,
                    existingQuestions: existingQuestionsPayload
                });

                if (!suggestions || suggestions.length === 0) {
                    toast.info(t('admin.booksTopicQuestionsAiEmpty'));
                    return;
                }

                const items: SuggestionItem[] = suggestions.map((suggestion) => ({
                    ...suggestion,
                    id: generateSuggestionId()
                }));

                const selections = items.reduce<Record<string, boolean>>((acc, item) => {
                    acc[item.id] = true;
                    return acc;
                }, {});

                setDialogState({ items, selections });
            } catch (error) {
                clientLogger.error('Topic question suggestions failed', error as Error, { bookId: book.id, topicId: topic.id });
                toast.error(t('admin.booksTopicQuestionsAiError'));
            }
        });
    }, [
        book.descriptionEn,
        book.descriptionUk,
        book.id,
        book.titleEn,
        book.titleUk,
        existingQuestionsPayload,
        startSuggestionsTransition,
        t,
        topic.id,
        topic.titleEn,
        topic.titleUk
    ]);

    const handleToggleSuggestion = useCallback((id: string) => {
        setDialogState((prev) => {
            if (!prev || !Object.hasOwn(prev.selections, id)) {
                return prev;
            }

            return {
                items: prev.items,
                selections: {
                    ...prev.selections,
                    [id]: !prev.selections[id]
                }
            };
        });
    }, []);

    const hasSelection = useMemo(() => {
        if (!dialogState) {
            return false;
        }
        return dialogState.items.some((item) => dialogState.selections[item.id]);
    }, [dialogState]);

    const handleApplySuggestions = useCallback(() => {
        if (!dialogState) {
            return;
        }

        const selected = dialogState.items.filter((item) => dialogState.selections[item.id]);

        if (selected.length === 0) {
            toast.info(t('admin.booksTopicQuestionsAiSelectionEmpty'));
            return;
        }

        startApplyTransition(async () => {
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
                setDialogState(null);
                router.refresh();
            } catch (error) {
                clientLogger.error('Topic question creation failed', error as Error, { bookId: book.id, topicId: topic.id });
                toast.error(t('admin.booksTopicQuestionsAiCreateError'));
            }
        });
    }, [book.id, dialogState, router, startApplyTransition, t, topic.id]);

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">{t('admin.booksTopicQuestionsTitle')}</h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
                        <Button asChild variant="outline">
                            <Link href={getAdminBookPath(book.id)}>{t('common.back')}</Link>
                        </Button>
                        <Button type="button" className="inline-flex items-center gap-2" onClick={handleGenerateSuggestions} disabled={suggestionsButtonDisabled}>
                            {isSuggestionsPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            {t('admin.booksTopicQuestionsAiButton')}
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {questions.length} {t('questions.resultsSuffix')}
                    </div>
                </div>

                {questions.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center">
                        <p className="text-sm text-muted-foreground">{t('admin.booksTopicQuestionsEmpty')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((question) => (
                            <QuestionCard key={question.id} question={question} locale={locale} t={t} />
                        ))}
                    </div>
                )}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => (!open ? handleCloseDialog() : null)}>
                <DialogContent className="h-[80vh] w-[80vw] max-w-[1024px] overflow-hidden p-0">
                    <div className="flex h-full flex-col">
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                {t('admin.booksTopicQuestionsAiModalTitle')}
                            </DialogTitle>
                            <DialogDescription>{t('admin.booksTopicQuestionsAiModalDescription')}</DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto px-6 pb-6">
                            {dialogState && dialogState.items.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {dialogState.items.map((item) => {
                                        const selected = dialogState.selections[item.id];
                                        const containerClass = selected
                                            ? 'space-y-4 rounded-lg border border-primary bg-primary/5 p-4'
                                            : 'space-y-4 rounded-lg border p-4';
                                        return (
                                            <div key={item.id} className={containerClass}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('books.level')}</p>
                                                        <p className="text-sm font-medium capitalize">{levelLabels[item.level]}</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={selected ? 'default' : 'outline'}
                                                        onClick={() => handleToggleSuggestion(item.id)}
                                                        aria-pressed={selected}
                                                    >
                                                        {selected ? t('questions.detailAiSelected') : t('questions.detailAiSelect')}
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                            {t('questions.detailTextUkLabel')}
                                                        </p>
                                                        <div className="rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                                            {item.textUk}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                            {t('questions.detailTextEnLabel')}
                                                        </p>
                                                        <div className="rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                                            {item.textEn}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                            {t('questions.detailTheoryUkLabel')}
                                                        </p>
                                                        <div className="rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">
                                                            {item.theoryUk}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                            {t('questions.detailTheoryEnLabel')}
                                                        </p>
                                                        <div className="rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">
                                                            {item.theoryEn}
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
                        <DialogFooter className="flex items-center justify-between gap-3 border-t px-6 py-4">
                            <Button type="button" variant="secondary" onClick={handleCloseDialog} disabled={isApplyPending}>
                                {t('questions.detailAiDismiss')}
                            </Button>
                            <Button type="button" onClick={handleApplySuggestions} disabled={!hasSelection || isApplyPending}>
                                {isApplyPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t('questions.detailAiApply')}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
