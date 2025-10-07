'use client';

import { BookOpen } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Prose } from '@/components/prose/Prose';
import AnswerCard from '@/components/testingModal/components/AnswerCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbBookQuestion } from '@/lib/repositories/bookRepository';
import type { PublicAnswer } from '@/lib/repositories/questionRepository';
import { fetchQuestionAnswers } from '@/lib/repositories/questions.server';
import type { UserLocale } from '@/lib/types/user';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TestingModalProps {
    isOpen: boolean;
    onClose: () => void;
    questions: DbBookQuestion[];
    locale: UserLocale;
}

export default function TestingModal({ isOpen, onClose, questions, locale }: TestingModalProps): React.ReactElement {
    const t = useI18n();

    const iteratorRef = useRef<Iterator<DbBookQuestion>>(questions.values()[Symbol.iterator]());
    const [currentQuestion, setCurrentQuestion] = useState<DbBookQuestion | null>(() => {
        const next = iteratorRef.current.next();
        return next.done ? null : next.value;
    });
    const [theory, setTheory] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const [isPending, startTransition] = useTransition();
    const [selectedAnswerIds, setSelectedAnswerIds] = useState<Set<string>>(new Set());
    const [answers, setAnswers] = useState<Array<PublicAnswer>>([]);

    const questionText = useMemo<string>(() => {
        if (!currentQuestion) return '';
        return locale === 'uk' ? currentQuestion.textUk : currentQuestion.textEn;
    }, [currentQuestion, locale]);

    const handleAnswerClick = useCallback((): void => {
        if (!currentQuestion) return;

        // Determine if answer is correct on client side
        const correctAnswerIds = answers.filter((answer) => answer.isCorrect).map((answer) => answer.id);
        const selectedSet = new Set(selectedAnswerIds);
        const correctSet = new Set(correctAnswerIds);

        // Answer is correct if all correct answers are selected and no incorrect ones
        const isCorrect =
            correctAnswerIds.every((id) => selectedSet.has(id)) && selectedAnswerIds.size > 0 && Array.from(selectedAnswerIds).every((id) => correctSet.has(id));

        startTransition(async () => {
            try {
                const response = await fetch(`/api/questions/${currentQuestion.id}/answer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        isCorrect
                    })
                });

                if (response.ok) {
                    setIsAnswered(true);
                } else {
                    clientLogger.error('Failed to submit answer - server error', new Error(`HTTP ${response.status}`));
                    toast.error(t('common.error'));
                }
            } catch (error) {
                clientLogger.error('Failed to submit answer', error as Error);
                toast.error(t('common.error'));
            }
        });
    }, [currentQuestion, answers, selectedAnswerIds, t]);

    const nextQuestion = useCallback((): void => {
        const next = iteratorRef.current.next();
        if (next.done) {
            onClose();
            return;
        }
        setSelectedAnswerIds(new Set());
        setAnswers([]);
        setCurrentQuestion(next.value);
        setIsAnswered(false);
        setCurrentIndex(currentIndex + 1);
    }, [currentIndex, onClose]);

    const toggleAnswer = (id: string): void => {
        setSelectedAnswerIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    const fetchAnswers = useCallback(async (): Promise<void> => {
        startTransition(async () => {
            setAnswers([]);
            if (!currentQuestion) return;
            const data = await fetchQuestionAnswers(currentQuestion.id);
            setAnswers(data.sort(() => Math.random() - 0.5));
        });
    }, [currentQuestion]);

    useEffect(() => {
        fetchAnswers();
    }, [fetchAnswers]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={theory ? () => setTheory(null) : onClose}>
                <DialogContent className="w-[90vw] h-[90vh] max-w-none flex flex-col">
                    {theory ? (
                        <div className="flex-1 overflow-y-auto max-w-none p-4">
                            <Prose isMD>{theory}</Prose>
                        </div>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">
                                    {t('books.testingTitle')}
                                    {questions.length > 0 ? ` (${currentIndex + 1} ${t('books.testingProgressConnector')} ${questions.length})` : ''}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto prose dark:prose-invert prose-sm max-w-none p-4">
                                {currentQuestion ? (
                                    <div className="space-y-4">
                                        {isAnswered && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const theory = locale === 'uk' ? currentQuestion.theoryUk : currentQuestion.theoryEn;
                                                            setTheory(theory);
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
                                        <Prose className="text-base" isMD>
                                            {questionText}
                                        </Prose>
                                        <p className="text-xs text-muted-foreground">{t('books.selectAllCorrect')}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {answers.map((a) => (
                                                <AnswerCard
                                                    locale={locale}
                                                    key={a.id}
                                                    answer={a}
                                                    selected={selectedAnswerIds.has(a.id)}
                                                    onToggle={toggleAnswer}
                                                    showTheory={(t) => setTheory(t)}
                                                    answered={isAnswered}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">—</p>
                                )}
                            </div>
                            <div className="p-4 border-t flex justify-end gap-2">
                                <Button onClick={handleAnswerClick} disabled={answers.length === 0 || isPending || isAnswered}>
                                    {t('books.answerQuestion')}
                                </Button>
                                <Button variant="outline" onClick={nextQuestion}>
                                    {t('books.nextQuestion')}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
