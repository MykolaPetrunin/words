import React from 'react';

import { getAllBooks } from '@/lib/repositories/bookRepository';
import { getAllSubjects } from '@/lib/repositories/subjectRepository';

import BooksPageClient from './BooksPageClient';

export default async function AdminBooksPage(): Promise<React.ReactElement> {
    const [books, subjects] = await Promise.all([getAllBooks(), getAllSubjects()]);
    return <BooksPageClient initialBooks={books} subjects={subjects} />;
}
