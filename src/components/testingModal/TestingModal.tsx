'use client';

import { BookOpen } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Prose } from '@/components/prose/Prose';
import AnswerCard from '@/components/testingModal/components/AnswerCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import type { DbBookQuestion } from '@/lib/repositories/bookRepository';
import type { PublicAnswer } from '@/lib/repositories/questionRepository';
import { fetchQuestionAnswers } from '@/lib/repositories/questions.server';
import type { UserLocale } from '@/lib/types/user';
import { cn } from '@/lib/utils';

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

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAnswersLoading, setIsAnswersLoading] = useState<boolean>(false);
    const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
    const [selectedAnswerIds, setSelectedAnswerIds] = useState<Set<string>>(new Set());
    const [answers, setAnswers] = useState<Array<PublicAnswer>>([]);

    const questionText = useMemo<string>(() => {
        if (!currentQuestion) return '';
        return locale === 'uk' ? currentQuestion.textUk : currentQuestion.textEn;
    }, [currentQuestion, locale]);

    const handleAnswerClick = useCallback((): void => {
        if (!currentQuestion || isSubmitting) return;

        const correctAnswerIds = answers.filter((answer) => answer.isCorrect).map((answer) => answer.id);
        const selectedSet = new Set(selectedAnswerIds);
        const correctSet = new Set(correctAnswerIds);

        const isCorrect =
            correctAnswerIds.every((id) => selectedSet.has(id)) && selectedAnswerIds.size > 0 && Array.from(selectedAnswerIds).every((id) => correctSet.has(id));

        setIsSubmitting(true);

        const submitAnswer = async (): Promise<void> => {
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
                    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
                } else {
                    clientLogger.error('Failed to submit answer - server error', new Error(`HTTP ${response.status}`));
                    toast.error(t('common.error'));
                }
            } catch (error) {
                clientLogger.error('Failed to submit answer', error as Error);
                toast.error(t('common.error'));
            } finally {
                setIsSubmitting(false);
            }
        };

        void submitAnswer();
    }, [currentQuestion, isSubmitting, answers, selectedAnswerIds, t]);

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
        setAnswerStatus(null);
        setTheory(null);
        setIsSubmitting(false);
    }, [currentIndex, onClose]);

    const toggleAnswer = (id: string): void => {
        if (isSubmitting || isAnswered) return;
        setSelectedAnswerIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    const fetchAnswers = useCallback(async (): Promise<void> => {
        if (!currentQuestion) {
            setAnswers([]);
            return;
        }

        setIsAnswersLoading(true);
        setAnswers([]);

        try {
            const data = await fetchQuestionAnswers(currentQuestion.id);
            setAnswers(data.sort(() => Math.random() - 0.5));
        } catch (error) {
            clientLogger.error('Failed to load answers', error as Error);
            toast.error(t('common.error'));
        } finally {
            setIsAnswersLoading(false);
        }
    }, [currentQuestion, t]);

    useEffect(() => {
        fetchAnswers();
    }, [fetchAnswers]);

    const titleClassName = useMemo<string>(
        () =>
            cn('text-xl font-semibold', {
                'text-emerald-600': isAnswered && answerStatus === 'correct',
                'text-red-500': isAnswered && answerStatus === 'incorrect'
            }),
        [isAnswered, answerStatus]
    );

    const skeletonItems = useMemo<Array<number>>(() => Array.from({ length: 4 }, (_, index) => index), []);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={theory ? () => setTheory(null) : onClose}>
                <DialogContent className="w-[90vw] h-[85vh] max-h-[85vh] sm:h-[90vh] sm:max-h-[90vh] max-w-none flex flex-col">
                    {theory ? (
                        <div className="flex-1 overflow-y-auto max-w-none p-4">
                            <Prose isMD>{theory}</Prose>
                        </div>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className={titleClassName}>
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
                                        <Prose className="text-base leading-6 text-foreground dark:text-foreground" isMD>
                                            {questionText}
                                        </Prose>
                                        <p className="text-xs text-muted-foreground">{t('books.selectAllCorrect')}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {isAnswersLoading
                                                ? skeletonItems.map((item) => <Skeleton key={item} className="h-32 w-full" />)
                                                : answers.map((a) => (
                                                      <AnswerCard
                                                          locale={locale}
                                                          key={a.id}
                                                          answer={a}
                                                          selected={selectedAnswerIds.has(a.id)}
                                                          onToggle={toggleAnswer}
                                                          showTheory={(value) => setTheory(value)}
                                                          answered={isAnswered}
                                                          disabled={isSubmitting}
                                                      />
                                                  ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">—</p>
                                )}
                            </div>
                            <div className="p-4 border-t flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={handleAnswerClick}
                                    disabled={answers.length === 0 || isSubmitting || isAnswered || isAnswersLoading}
                                >
                                    {t('books.answerQuestion')}
                                </Button>
                                <Button className="w-full sm:w-auto" variant="outline" onClick={nextQuestion}>
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
