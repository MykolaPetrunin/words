import { notFound } from 'next/navigation';
import React from 'react';

import { getBookWithRelations } from '@/lib/repositories/bookRepository';
import { getAllQuestions } from '@/lib/repositories/questionRepository';
import { getTopicById } from '@/lib/repositories/topicRepository';

import TopicQuestionsPageClient from './TopicQuestionsPageClient';

interface AdminBookTopicParams {
    readonly id: string;
    readonly topicId: string;
}

export default async function AdminBookTopicPage({ params }: { params: Promise<AdminBookTopicParams> }): Promise<React.ReactElement> {
    const { id: bookId, topicId } = await params;

    const [book, topic, questions] = await Promise.all([getBookWithRelations(bookId), getTopicById(topicId), getAllQuestions({ topicIds: [topicId] })]);

    if (!book || !topic || topic.bookId !== bookId) {
        notFound();
    }

    return (
        <TopicQuestionsPageClient
            book={{ id: book.id, titleUk: book.titleUk, titleEn: book.titleEn }}
            topic={{ id: topic.id, titleUk: topic.titleUk, titleEn: topic.titleEn }}
            questions={questions}
        />
    );
}
