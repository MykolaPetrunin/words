import { notFound } from 'next/navigation';
import React from 'react';

import { getBookWithRelations } from '@/lib/repositories/bookRepository';
import { getAllQuestions } from '@/lib/repositories/questionRepository';
import { getTopicById } from '@/lib/repositories/topicRepository';

import TopicQuestionsPageClient from './components/topicQuestionsPageClient/TopicQuestionsPageClient';

interface AdminBookTopicParams {
    readonly id: string;
    readonly topicId: string;
}

export default async function AdminBookTopicPage({ params }: { params: Promise<AdminBookTopicParams> }): Promise<React.ReactElement> {
    const { id: bookId, topicId } = await params;

    const [book, topic, questions] = await Promise.all([
        getBookWithRelations(bookId),
        getTopicById(topicId),
        getAllQuestions({ topicIds: [topicId], includeInactive: true })
    ]);

    if (!book || !topic || topic.bookId !== bookId) {
        notFound();
    }

    const otherTopics = book.topics
        .filter((bookTopic) => bookTopic.id !== topic.id)
        .map((bookTopic) => ({
            id: bookTopic.id,
            titleUk: bookTopic.titleUk,
            titleEn: bookTopic.titleEn
        }));

    return (
        <TopicQuestionsPageClient
            book={{
                id: book.id,
                titleUk: book.titleUk,
                titleEn: book.titleEn,
                descriptionUk: book.descriptionUk ?? '',
                descriptionEn: book.descriptionEn ?? ''
            }}
            topic={{ id: topic.id, titleUk: topic.titleUk, titleEn: topic.titleEn }}
            questions={questions}
            otherTopics={otherTopics}
        />
    );
}
