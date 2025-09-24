import { notFound } from 'next/navigation';
import React from 'react';

import BooksGrid from '@/components/booksGrid/BooksGrid';
import { getBooksBySubjectId } from '@/lib/repositories/bookRepository';
import { getSubjectById } from '@/lib/repositories/subjectRepository';

interface SubjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SubjectPage({ params }: SubjectPageProps): Promise<React.ReactElement> {
    const { id } = await params;

    const subject = await getSubjectById(id);

    if (!subject) {
        notFound();
    }

    const books = await getBooksBySubjectId(id);

    return <BooksGrid books={books} subject={subject} />;
}
