import React from 'react';

import { getAllBooks } from '@/lib/repositories/bookRepository';
import { getAllSubjects } from '@/lib/repositories/subjectRepository';
import { getAllTopics } from '@/lib/repositories/topicRepository';

import BooksPageClient from './BooksPageClient';

export default async function AdminBooksPage(): Promise<React.ReactElement> {
    const [books, subjects, topics] = await Promise.all([getAllBooks(), getAllSubjects(), getAllTopics()]);
    return <BooksPageClient initialBooks={books} subjects={subjects} topics={topics} />;
}
