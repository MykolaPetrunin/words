'use client';

import { Loader2, Sparkles } from 'lucide-react';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { type Path, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/hooks/useI18n';
import type { I18nKey } from '@/lib/i18n/types';
import { clientLogger } from '@/lib/logger';

import type { QuestionFormData } from '../../schemas';

import { reviewQuestionClarity, reviewQuestionTheory } from './aiActions';

type ReviewKind = 'clarity' | 'theory';

interface ClarityQuestionSuggestion {
    improvedTextUK: string;
    improvedTextEN: string;
}

interface ClarityAnswerSuggestion {
    id: string;
    improvedTextUK: string;
    improvedTextEN: string;
    isCorrect: boolean;
}

interface TheoryQuestionSuggestion {
    improvedTheoryUK: string;
    improvedTheoryEN: string;
}

interface TheoryAnswerSuggestion {
    id: string;
    improvedTheoryUK: string;
    improvedTheoryEN: string;
    isCorrect: boolean;
}

interface ClaritySuggestion {
    question?: ClarityQuestionSuggestion;
    answers?: ClarityAnswerSuggestion[];
}

interface TheorySuggestion {
    question?: TheoryQuestionSuggestion;
    answers?: TheoryAnswerSuggestion[];
}

type SuggestionState =
    | {
          kind: 'clarity';
          suggestion: ClaritySuggestion;
          source: QuestionFormData;
          questionSelected: boolean;
          answerSelections: Record<string, boolean>;
      }
    | {
          kind: 'theory';
          suggestion: TheorySuggestion;
          source: QuestionFormData;
          questionSelected: boolean;
          answerSelections: Record<string, boolean>;
      };

interface QuestionAiActionsProps {
    questionId: string;
    form: UseFormReturn<QuestionFormData>;
}

interface GroupRow {
    key: string;
    label: string;
    current: string;
    suggested: string;
}

const cloneFormData = (data: QuestionFormData): QuestionFormData => JSON.parse(JSON.stringify(data)) as QuestionFormData;

export default function QuestionAiActions({ questionId, form }: QuestionAiActionsProps): React.ReactElement {
    const t = useI18n();
    const [dialogState, setDialogState] = useState<SuggestionState | null>(null);
    const [isPending, startTransition] = useTransition();

    const errorFallbackKey: I18nKey = 'questions.detailAiError';
    const applySuccessKey: I18nKey = 'questions.detailAiApplySuccess';

    const closeDialog = useCallback(() => {
        setDialogState(null);
    }, []);

    const openDialog = useCallback((state: SuggestionState) => {
        setDialogState(state);
    }, []);

    const handleToggleQuestion = useCallback(() => {
        setDialogState((prev) => {
            if (!prev || !prev.suggestion.question) {
                return prev;
            }
            return { ...prev, questionSelected: !prev.questionSelected };
        });
    }, []);

    const handleToggleAnswer = useCallback((answerId: string) => {
        setDialogState((prev) => {
            if (!prev || !(answerId in prev.answerSelections)) {
                return prev;
            }
            return {
                ...prev,
                answerSelections: {
                    ...prev.answerSelections,
                    [answerId]: !prev.answerSelections[answerId]
                }
            };
        });
    }, []);

    const submitReview = useCallback(
        (kind: ReviewKind) => {
            const values = form.getValues();
            const source = cloneFormData(values);
            startTransition(async () => {
                try {
                    if (kind === 'clarity') {
                        const suggestion = await reviewQuestionClarity(source);
                        if (!suggestion) {
                            toast.info(t('questions.detailAiNoChanges'));
                            return;
                        }
                        const questionSelected = Boolean(suggestion.question);
                        const answerSelections = (suggestion.answers ?? []).reduce<Record<string, boolean>>((acc, answer) => {
                            acc[answer.id] = true;
                            return acc;
                        }, {});
                        openDialog({ kind, suggestion, source, questionSelected, answerSelections });
                        return;
                    }
                    const suggestion = await reviewQuestionTheory(source);
                    if (!suggestion) {
                        toast.info(t('questions.detailAiNoChanges'));
                        return;
                    }
                    const questionSelected = Boolean(suggestion.question);
                    const answerSelections = (suggestion.answers ?? []).reduce<Record<string, boolean>>((acc, answer) => {
                        acc[answer.id] = true;
                        return acc;
                    }, {});
                    openDialog({ kind, suggestion, source, questionSelected, answerSelections });
                } catch (error) {
                    clientLogger.error('Question AI review failed', error as Error, { questionId, kind });
                    toast.error(t(errorFallbackKey));
                }
            });
        },
        [errorFallbackKey, form, openDialog, questionId, t]
    );

    const dialogTitle = useMemo(() => {
        if (!dialogState) {
            return '';
        }
        return dialogState.kind === 'clarity' ? t('questions.detailAiClarityTitle') : t('questions.detailAiTheoryTitle');
    }, [dialogState, t]);

    const dialogDescription = useMemo(() => {
        if (!dialogState) {
            return '';
        }
        return dialogState.kind === 'clarity' ? t('questions.detailAiClarityDescription') : t('questions.detailAiTheoryDescription');
    }, [dialogState, t]);

    const dialogContent = useMemo(() => {
        if (!dialogState) {
            return null;
        }
        const currentLabel = t('questions.detailAiCurrentLabel');
        const suggestedLabel = t('questions.detailAiSuggestedLabel');
        const toggleSelectedLabel = t('questions.detailAiSelected');
        const toggleSelectLabel = t('questions.detailAiSelect');

        const blocks: React.ReactNode[] = [];

        if (dialogState.kind === 'clarity') {
            const { suggestion, source, questionSelected, answerSelections } = dialogState;
            if (suggestion.question) {
                const items: GroupRow[] = [
                    {
                        key: 'question-uk',
                        label: t('questions.detailTextUkLabel'),
                        current: source.textUk,
                        suggested: suggestion.question.improvedTextUK
                    },
                    {
                        key: 'question-en',
                        label: t('questions.detailTextEnLabel'),
                        current: source.textEn,
                        suggested: suggestion.question.improvedTextEN
                    }
                ];
                const containerClass = questionSelected ? 'space-y-4 rounded-lg border border-primary bg-primary/5 p-3' : 'space-y-4 rounded-lg border p-3';
                blocks.push(
                    <div key="question" className={containerClass}>
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{t('questions.detailAiQuestionGroup')}</p>
                            <Button
                                type="button"
                                variant={questionSelected ? 'default' : 'outline'}
                                size="sm"
                                onClick={handleToggleQuestion}
                                aria-pressed={questionSelected}
                            >
                                {questionSelected ? toggleSelectedLabel : toggleSelectLabel}
                            </Button>
                        </div>
                        {items.map((item) => (
                            <div key={item.key} className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{currentLabel}</p>
                                        <div className="rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                            {item.current}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{suggestedLabel}</p>
                                        <div className="rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">{item.suggested}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }

            const answerGroups: React.ReactNode[] = [];
            suggestion.answers?.forEach((answer) => {
                const sourceIndex = source.answers.findIndex((item) => item.id === answer.id);
                if (sourceIndex === -1) {
                    return;
                }
                const selected = answerSelections[answer.id] ?? false;
                const order = sourceIndex + 1;
                const sourceAnswer = source.answers[sourceIndex];
                const items: GroupRow[] = [
                    {
                        key: `answer-${answer.id}-uk`,
                        label: t('questions.detailAnswerTextUk'),
                        current: sourceAnswer.textUk,
                        suggested: answer.improvedTextUK
                    },
                    {
                        key: `answer-${answer.id}-en`,
                        label: t('questions.detailAnswerTextEn'),
                        current: sourceAnswer.textEn,
                        suggested: answer.improvedTextEN
                    }
                ];
                const containerClass = selected ? 'space-y-4 rounded-lg border border-primary bg-primary/5 p-3' : 'space-y-4 rounded-lg border p-3';
                answerGroups.push(
                    <div key={`answer-${answer.id}`} className={containerClass}>
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{`${t('questions.detailAiAnswerGroupLabel')} #${order}`}</p>
                            <Button
                                type="button"
                                variant={selected ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleToggleAnswer(answer.id)}
                                aria-pressed={selected}
                            >
                                {selected ? toggleSelectedLabel : toggleSelectLabel}
                            </Button>
                        </div>
                        {items.map((item) => (
                            <div key={item.key} className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{currentLabel}</p>
                                        <div className="rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                            {item.current}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{suggestedLabel}</p>
                                        <div className="rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">{item.suggested}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            });

            if (blocks.length === 0 && answerGroups.length === 0) {
                return <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">{t('questions.detailAiNoChanges')}</div>;
            }

            if (blocks.length > 0 && answerGroups.length > 0) {
                blocks.push(<Separator key="separator" />);
            }
            blocks.push(...answerGroups);
            return <div className="space-y-4">{blocks}</div>;
        }

        const { suggestion, source, questionSelected, answerSelections } = dialogState;
        if (suggestion.question) {
            const items: GroupRow[] = [
                {
                    key: 'question-theory-uk',
                    label: t('questions.detailTheoryUkLabel'),
                    current: source.theoryUk,
                    suggested: suggestion.question.improvedTheoryUK
                },
                {
                    key: 'question-theory-en',
                    label: t('questions.detailTheoryEnLabel'),
                    current: source.theoryEn,
                    suggested: suggestion.question.improvedTheoryEN
                }
            ];
            const containerClass = questionSelected ? 'space-y-4 rounded-lg border border-primary bg-primary/5 p-3' : 'space-y-4 rounded-lg border p-3';
            blocks.push(
                <div key="question-theory" className={containerClass}>
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{t('questions.detailAiQuestionGroup')}</p>
                        <Button type="button" variant={questionSelected ? 'default' : 'outline'} size="sm" onClick={handleToggleQuestion} aria-pressed={questionSelected}>
                            {questionSelected ? toggleSelectedLabel : toggleSelectLabel}
                        </Button>
                    </div>
                    {items.map((item) => (
                        <div key={item.key} className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{currentLabel}</p>
                                    <div className="rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                        {item.current}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{suggestedLabel}</p>
                                    <div className="rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">{item.suggested}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        const answerGroups: React.ReactNode[] = [];
        suggestion.answers?.forEach((answer) => {
            const sourceIndex = source.answers.findIndex((item) => item.id === answer.id);
            if (sourceIndex === -1) {
                return;
            }
            const selected = answerSelections[answer.id] ?? false;
            const order = sourceIndex + 1;
            const sourceAnswer = source.answers[sourceIndex];
            const items: GroupRow[] = [
                {
                    key: `answer-theory-${answer.id}-uk`,
                    label: t('questions.detailAnswerTheoryUk'),
                    current: sourceAnswer.theoryUk,
                    suggested: answer.improvedTheoryUK
                },
                {
                    key: `answer-theory-${answer.id}-en`,
                    label: t('questions.detailAnswerTheoryEn'),
                    current: sourceAnswer.theoryEn,
                    suggested: answer.improvedTheoryEN
                }
            ];
            const containerClass = selected ? 'space-y-4 rounded-lg border border-primary bg-primary/5 p-3' : 'space-y-4 rounded-lg border p-3';
            answerGroups.push(
                <div key={`answer-theory-${answer.id}`} className={containerClass}>
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{`${t('questions.detailAiAnswerGroupLabel')} #${order}`}</p>
                        <Button type="button" variant={selected ? 'default' : 'outline'} size="sm" onClick={() => handleToggleAnswer(answer.id)} aria-pressed={selected}>
                            {selected ? toggleSelectedLabel : toggleSelectLabel}
                        </Button>
                    </div>
                    {items.map((item) => (
                        <div key={item.key} className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{currentLabel}</p>
                                    <div className="rounded-md border bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                        {item.current}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{suggestedLabel}</p>
                                    <div className="rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">{item.suggested}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        });

        if (blocks.length === 0 && answerGroups.length === 0) {
            return <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">{t('questions.detailAiNoChanges')}</div>;
        }

        if (blocks.length > 0 && answerGroups.length > 0) {
            blocks.push(<Separator key="separator" />);
        }
        blocks.push(...answerGroups);
        return <div className="space-y-4">{blocks}</div>;
    }, [dialogState, handleToggleAnswer, handleToggleQuestion, t]);

    const applySuggestions = useCallback(() => {
        if (!dialogState) {
            return;
        }
        if (dialogState.kind === 'clarity') {
            const { suggestion, source, questionSelected, answerSelections } = dialogState;
            if (questionSelected && suggestion.question) {
                form.setValue('textUk', suggestion.question.improvedTextUK, { shouldDirty: true, shouldTouch: true });
                form.setValue('textEn', suggestion.question.improvedTextEN, { shouldDirty: true, shouldTouch: true });
            }
            suggestion.answers?.forEach((answer) => {
                if (!answerSelections[answer.id]) {
                    return;
                }
                const targetIndex = source.answers.findIndex((item) => item.id === answer.id);
                if (targetIndex === -1) {
                    return;
                }
                const textUkPath = `answers.${targetIndex}.textUk` as Path<QuestionFormData>;
                const textEnPath = `answers.${targetIndex}.textEn` as Path<QuestionFormData>;
                form.setValue(textUkPath, answer.improvedTextUK, { shouldDirty: true, shouldTouch: true });
                form.setValue(textEnPath, answer.improvedTextEN, { shouldDirty: true, shouldTouch: true });
            });
            toast.success(t(applySuccessKey));
            closeDialog();
            return;
        }
        const { suggestion, source, questionSelected, answerSelections } = dialogState;
        if (questionSelected && suggestion.question) {
            form.setValue('theoryUk', suggestion.question.improvedTheoryUK, { shouldDirty: true, shouldTouch: true });
            form.setValue('theoryEn', suggestion.question.improvedTheoryEN, { shouldDirty: true, shouldTouch: true });
        }
        suggestion.answers?.forEach((answer) => {
            if (!answerSelections[answer.id]) {
                return;
            }
            const targetIndex = source.answers.findIndex((item) => item.id === answer.id);
            if (targetIndex === -1) {
                return;
            }
            const theoryUkPath = `answers.${targetIndex}.theoryUk` as Path<QuestionFormData>;
            const theoryEnPath = `answers.${targetIndex}.theoryEn` as Path<QuestionFormData>;
            form.setValue(theoryUkPath, answer.improvedTheoryUK, { shouldDirty: true, shouldTouch: true });
            form.setValue(theoryEnPath, answer.improvedTheoryEN, { shouldDirty: true, shouldTouch: true });
        });
        toast.success(t(applySuccessKey));
        closeDialog();
    }, [applySuccessKey, closeDialog, dialogState, form, t]);

    const hasDialogContent = dialogContent !== null;

    const hasSelection = useMemo(() => {
        if (!dialogState) {
            return false;
        }
        if (dialogState.questionSelected) {
            return true;
        }
        return Object.values(dialogState.answerSelections).some(Boolean);
    }, [dialogState]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="inline-flex items-center gap-2" disabled={isPending}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {t('questions.detailAiLabel')}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem onSelect={() => submitReview('clarity')} disabled={isPending}>
                        {t('questions.detailAiClarityAction')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => submitReview('theory')} disabled={isPending}>
                        {t('questions.detailAiTheoryAction')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={dialogState !== null} onOpenChange={(open) => (!open ? closeDialog() : null)}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            {dialogTitle}
                        </DialogTitle>
                        <DialogDescription>{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    {hasDialogContent && dialogContent}
                    <DialogFooter className="mt-6 flex items-center justify-between gap-3 border-t pt-4">
                        <Button type="button" variant="secondary" onClick={closeDialog}>
                            {t('questions.detailAiDismiss')}
                        </Button>
                        <Button type="button" onClick={applySuggestions} disabled={!hasDialogContent || !hasSelection}>
                            {t('questions.detailAiApply')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
