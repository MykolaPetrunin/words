'use client';

import Link from 'next/link';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminQuestionPath } from '@/lib/appPaths';
import type { I18nKey } from '@/lib/i18n/types';
import type { QuestionListItem } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

interface QuestionCardProps {
    question: QuestionListItem;
    locale: UserLocale;
    t: (key: I18nKey) => string;
}

export default function QuestionCard({ question, locale, t }: QuestionCardProps): React.ReactElement {
    const questionText = locale === 'uk' ? question.textUk : question.textEn;
    const levelLabel = locale === 'uk' ? question.level.nameUk : question.level.nameEn;
    const topicLabel = question.topic ? (locale === 'uk' ? question.topic.titleUk : question.topic.titleEn) : null;

    return (
        <Link href={getAdminQuestionPath(question.id)} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="border transition hover:border-primary/60">
                <CardHeader className="space-y-3">
                    <CardTitle className="text-base font-semibold leading-relaxed">{questionText}</CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>
                            {t('questions.levelLabel')}: {levelLabel}
                        </span>
                        {topicLabel && (
                            <span>
                                {t('questions.topicLabel')}: {topicLabel}
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm font-medium text-foreground">{t('questions.booksHeading')}</p>
                    <div className="flex flex-wrap gap-3">
                        {question.books.map((book) => {
                            const bookTitle = locale === 'uk' ? book.titleUk : book.titleEn;
                            const subjectNames = book.subjects.map((subject) => (locale === 'uk' ? subject.nameUk : subject.nameEn));
                            return (
                                <div key={book.id} className="rounded-md border bg-muted/40 px-3 py-2">
                                    <p className="text-sm font-medium leading-snug">{bookTitle}</p>
                                    {subjectNames.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {t('questions.subjectsLabel')}: {subjectNames.join(', ')}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
