'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import BookActions from '@/components/bookActions/BookActions';
import BookQuestionsList from '@/components/bookQuestionsList/BookQuestionsList';
import TestingModal from '@/components/testingModal/TestingModal';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger/clientLogger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { DbBookQuestion, DbBookWithQuestions } from '@/lib/repositories/bookRepository';
import type { UserLocale } from '@/lib/types/user';

interface BookPageClientProps {
    book: DbBookWithQuestions;
}

export default function BookPageClient({ book: initialBook }: BookPageClientProps): React.ReactElement {
    const [book, setBook] = useState<DbBookWithQuestions>(initialBook);
    const user = useAppSelector((s) => s.currentUser.user);
    const locale: UserLocale = user?.locale === 'en' ? 'en' : 'uk';
    const t = useI18n();
    const [testQuestions, setTestQuestions] = useState<DbBookQuestion[]>([]);

    const bookTitle = locale === 'uk' ? book.titleUk : book.titleEn;

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

            const updatedBook = await response.json();
            setBook((prevBook) => ({
                ...prevBook,
                isLearning: updatedBook.isLearning,
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

    const _sortedQuestions = useMemo<DbBookQuestion[]>(() => {
        return book.questions.sort((a, b) => {
            const scoreA = a.userScore ?? 0;
            const scoreB = b.userScore ?? 0;

            if (scoreA !== scoreB) {
                return scoreA - scoreB;
            }

            const levelA = a.level.id;
            const levelB = b.level.id;

            return levelA.localeCompare(levelB);
        });
    }, [book.questions]);

    const handleStartTesting = useCallback((): void => {
        if (!user) {
            toast.error(t('common.unauthorized'));
            return;
        }

        toast.info(t('books.testingComingSoon'));
    }, [user, t]);

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

                    <BookQuestionsList questions={book.questions} locale={locale} />
                </div>
            </div>

            {testQuestions.length > 0 && (
                <TestingModal isOpen={testQuestions.length > 0} onClose={() => setTestQuestions([])} questions={testQuestions.values()} locale={locale} />
            )}
        </>
    );
}
