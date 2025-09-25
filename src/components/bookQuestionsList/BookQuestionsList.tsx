'use client';

import React from 'react';

import { useI18n } from '@/hooks/useI18n';
import type { DbBookWithQuestions } from '@/lib/repositories/bookRepository';
import type { UserLocale } from '@/lib/types/user';

import QuestionItem from './components/QuestionItem';

interface BookQuestionsListProps {
    questions: DbBookWithQuestions['questions'];
    locale: UserLocale;
}

export default function BookQuestionsList({ questions, locale }: BookQuestionsListProps): React.ReactElement {
    const t = useI18n();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('books.questionsList')}</h2>
            <div className="space-y-2">
                {questions.map((question, index) => (
                    <QuestionItem key={question.id} index={index} question={question} locale={locale} />
                ))}
            </div>
        </div>
    );
}
