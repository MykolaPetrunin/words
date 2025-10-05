import { notFound } from 'next/navigation';
import React from 'react';

import { getAllTopics, getQuestionDetailById } from '@/lib/repositories/questionRepository';

import QuestionPageClient from './QuestionPageClient';

interface QuestionPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function QuestionPage({ params }: QuestionPageProps): Promise<React.ReactElement> {
    const { id } = await params;
    const [question, topics] = await Promise.all([getQuestionDetailById(id), getAllTopics()]);

    if (!question) {
        notFound();
    }

    return <QuestionPageClient question={question} topics={topics} />;
}
