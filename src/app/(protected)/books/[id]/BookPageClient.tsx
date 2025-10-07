'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import BookActions from '@/components/bookActions/BookActions';
import BookQuestionsList from '@/components/bookQuestionsList/BookQuestionsList';
import QuestionsListSkeleton from '@/components/bookQuestionsList/components/QuestionsListSkeleton';
import TestingModal from '@/components/testingModal/TestingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger/clientLogger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { DbBookQuestion, DbBookWithLearningStatus, DbBookWithQuestions } from '@/lib/repositories/bookRepository';
import { getBookWithQuestions } from '@/lib/repositories/bookRepository';
import type { UserLocale } from '@/lib/types/user';

interface BookPageClientProps {
    book: DbBookWithQuestions;
}

export default function BookPageClient({ book: initialBook }: BookPageClientProps): React.ReactElement {
    const [book, setBook] = useState<DbBookWithQuestions>(initialBook);
    const [isBookSyncing, setIsBookSyncing] = useState<boolean>(false);
    const user = useAppSelector((s) => s.currentUser.user);

    const locale: UserLocale = user?.locale === 'en' ? 'en' : 'uk';
    const t = useI18n();
    const [testQuestions, setTestQuestions] = useState<DbBookQuestion[]>([]);

    const bookTitle = locale === 'uk' ? book.titleUk : book.titleEn;
    const levelProgress = useMemo(
        () => [
            {
                key: 'junior' as const,
                label: t('books.levelJunior'),
                value: book.levelCompletion.junior
            },
            {
                key: 'middle' as const,
                label: t('books.levelMiddle'),
                value: book.levelCompletion.middle
            },
            {
                key: 'senior' as const,
                label: t('books.levelSenior'),
                value: book.levelCompletion.senior
            }
        ],
        [book.levelCompletion.junior, book.levelCompletion.middle, book.levelCompletion.senior, t]
    );

    const handleLearningAction = async (action: 'start' | 'stop'): Promise<void> => {
        const isStarting = action === 'start';
        const endpoint = `/api/books/${book.id}/learning/${action}`;
        const logPrefix = isStarting ? 'starting' : 'stopping';

        try {
            const response = await fetch(endpoint, {
                method: 'POST'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    toast.error(t('common.unauthorized'));
                    return;
                }

                if (response.status === 404) {
                    toast.error(t('books.bookNotFound'));
                    return;
                }

                clientLogger.error(`Failed to ${action} learning`, new Error(errorData.error || 'Unknown error'), {
                    bookId: book.id,
                    status: response.status
                });
                toast.error(t(isStarting ? 'books.errorStartLearning' : 'books.errorStopLearning'));
                return;
            }

            const updatedBook: DbBookWithLearningStatus = await response.json();
            setBook((prevBook) => ({
                ...prevBook,
                isLearning: updatedBook.isLearning,
                levelCompletion: updatedBook.levelCompletion,
                userLevelScores: updatedBook.userLevelScores
            }));

            toast.success(t(isStarting ? 'books.startedLearning' : 'books.stoppedLearning'));
        } catch (error) {
            clientLogger.error(`Network error while ${logPrefix} learning`, error as Error, { bookId: book.id });
            toast.error(t('common.networkError'));
        }
    };

    const handleStartLearning = async (): Promise<void> => {
        await handleLearningAction('start');
    };

    const handleStopLearning = async (): Promise<void> => {
        await handleLearningAction('stop');
    };

    const sortedQuestions = useMemo<DbBookQuestion[]>(() => {
        const levelOrder = { junior: 0, middle: 1, senior: 2 };

        return book.questions.sort((a, b) => {
            const scoreA = a.userScore ?? 0;
            const scoreB = b.userScore ?? 0;

            if (scoreA !== scoreB) {
                return scoreA - scoreB;
            }

            const levelOrderA = levelOrder[a.level.key as keyof typeof levelOrder] ?? 999;
            const levelOrderB = levelOrder[b.level.key as keyof typeof levelOrder] ?? 999;

            return levelOrderA - levelOrderB;
        });
    }, [book.questions]);

    const handleStartTesting = useCallback((): void => {
        if (!user) {
            toast.error(t('common.unauthorized'));
            return;
        }

        const shuffledQuestions = [...sortedQuestions.slice(0, user.questionsPerSession)].sort(() => Math.random() - 0.5);

        setTestQuestions(shuffledQuestions);
    }, [sortedQuestions, user, t]);

    const handleTestingModalClose = useCallback(async (): Promise<void> => {
        setTestQuestions([]);

        if (!user) {
            return;
        }

        setIsBookSyncing(true);

        try {
            const updatedBook = await getBookWithQuestions(book.id, user.id);

            if (updatedBook) {
                setBook(updatedBook);
            } else {
                clientLogger.error('Failed to sync book - book not found', new Error('Book not found'), {
                    bookId: book.id,
                    userId: user.id
                });
                toast.error(t('books.errorSyncingBook'));
            }
        } catch (error) {
            clientLogger.error('Failed to sync book after testing', error as Error, {
                bookId: book.id,
                userId: user.id
            });
            toast.error(t('common.networkError'));
        } finally {
            setIsBookSyncing(false);
        }
    }, [book.id, user, t]);

    return (
        <>
            <div className="container mx-auto p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{bookTitle}</h1>
                        <BookActions
                            isLearning={book.isLearning}
                            onStartLearning={handleStartLearning}
                            onStopLearning={handleStopLearning}
                            onStartTesting={handleStartTesting}
                        />
                    </div>

                    <Card className="border-muted/40">
                        <CardHeader className="space-y-1 p-4 pb-2">
                            <CardTitle className="text-base font-semibold">{t('books.levelProgressTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 p-4 pt-0 sm:grid-cols-3">
                            {levelProgress.map((level) => (
                                <div key={level.key} className="space-y-2 rounded-md bg-muted/40 p-3">
                                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        <span>{level.label}</span>
                                        <span>{`${level.value}%`}</span>
                                    </div>
                                    <Progress value={level.value} className="h-1.5" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {isBookSyncing ? (
                        <QuestionsListSkeleton questionsCount={sortedQuestions.length} />
                    ) : (
                        <BookQuestionsList questions={sortedQuestions} locale={locale} />
                    )}
                </div>
            </div>

            {testQuestions.length > 0 && (
                <TestingModal isOpen={testQuestions.length > 0} onClose={handleTestingModalClose} questions={testQuestions.values()} locale={locale} />
            )}
        </>
    );
}
