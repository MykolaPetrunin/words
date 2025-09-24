'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import BookActions from '@/components/bookActions/BookActions';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger/clientLogger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { DbBookWithQuestions } from '@/lib/repositories/bookRepository';
import type { UserLocale } from '@/lib/types/user';

interface BookPageClientProps {
    book: DbBookWithQuestions;
}

export default function BookPageClient({ book: initialBook }: BookPageClientProps): React.ReactElement {
    const [book, setBook] = useState<DbBookWithQuestions>(initialBook);
    const user = useAppSelector((s) => s.currentUser.user);
    const locale: UserLocale = user?.locale === 'en' ? 'en' : 'uk';
    const t = useI18n();

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

    const handleStartTesting = (): void => {
        // TODO: Navigate to testing page
        toast.info(t('books.testingComingSoon'));
    };

    return (
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

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">{t('books.questionsList')}</h2>
                    <div className="space-y-2">
                        {book.questions.map((question, index) => {
                            const questionText = locale === 'uk' ? question.textUk : question.textEn;
                            const levelName = locale === 'uk' ? question.level.nameUk : question.level.nameEn;

                            return (
                                <div key={question.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <span className="text-sm text-muted-foreground font-medium">{index + 1}.</span>
                                        <div className="flex-1">
                                            <p className="text-sm">{questionText}</p>
                                            <span className="text-xs text-muted-foreground mt-1 inline-block">
                                                {t('books.level')}: {levelName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
