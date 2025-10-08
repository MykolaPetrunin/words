import { notFound } from 'next/navigation';
import React from 'react';

import { getBookWithRelations } from '@/lib/repositories/bookRepository';
import { getAllSubjects } from '@/lib/repositories/subjectRepository';
import { getAllTopics } from '@/lib/repositories/topicRepository';

import BookDetailPageClient from './BookDetailPageClient';

type AdminBookDetailParams = { id: string };

export default async function AdminBookDetailPage({ params }: { params: Promise<AdminBookDetailParams> }): Promise<React.ReactElement> {
    const { id } = await params;
    const [book, subjects, topics] = await Promise.all([getBookWithRelations(id), getAllSubjects(), getAllTopics()]);

    if (!book) {
        notFound();
    }

    return <BookDetailPageClient book={book} subjects={subjects} topics={topics} />;
}
