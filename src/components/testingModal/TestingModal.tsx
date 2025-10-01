'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { Prose } from '@/components/prose/Prose';
import AnswerCard from '@/components/testingModal/components/AnswerCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';
import type { DbBookQuestion } from '@/lib/repositories/bookRepository';
import type { PublicAnswer } from '@/lib/repositories/questionRepository';
import { fetchQuestionAnswers } from '@/lib/repositories/questions.server';
import type { UserLocale } from '@/lib/types/user';

interface TestingModalProps {
    isOpen: boolean;
    onClose: () => void;
    questions: Iterable<DbBookQuestion>;
    locale: UserLocale;
}

export default function TestingModal({ isOpen, onClose, questions, locale }: TestingModalProps): React.ReactElement {
    const t = useI18n();

    const iteratorRef = useRef<Iterator<DbBookQuestion>>(questions[Symbol.iterator]());
    const [currentQuestion, setCurrentQuestion] = useState<DbBookQuestion | null>(() => {
        const next = iteratorRef.current.next();
        return next.done ? null : next.value;
    });
    const [theory, setTheory] = useState<string | null>(null);

    const [isPending, startTransition] = useTransition();
    const [selectedAnswerIds, setSelectedAnswerIds] = useState<Set<string>>(new Set());
    const [answers, setAnswers] = useState<Array<PublicAnswer>>([]);

    const questionText = useMemo<string>(() => {
        if (!currentQuestion) return '';
        return locale === 'uk' ? currentQuestion.textUk : currentQuestion.textEn;
    }, [currentQuestion, locale]);

    const handleAnswerClick = (): void => {
        console.info('handleAnswerClick');
    };

    const nextQuestion = useCallback((): void => {
        const next = iteratorRef.current.next();
        if (next.done) {
            onClose();
            return;
        }
        setSelectedAnswerIds(new Set());
        setAnswers([]);
        setCurrentQuestion(next.value);
    }, [onClose]);

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
            setAnswers(data);
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
                                <DialogTitle className="text-xl font-semibold">{t('books.testingTitle')}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto prose dark:prose-invert prose-sm max-w-none p-4">
                                {currentQuestion ? (
                                    <div className="space-y-4">
                                        <p className="text-base">{questionText}</p>
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
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">—</p>
                                )}
                            </div>
                            <div className="p-4 border-t flex justify-end gap-2">
                                <Button variant="outline" onClick={nextQuestion}>
                                    {t('books.nextQuestion')}
                                </Button>
                                <Button onClick={handleAnswerClick} disabled={answers.length === 0 || isPending}>
                                    {t('books.answerQuestion')}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
