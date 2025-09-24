import { notFound } from 'next/navigation';
import React from 'react';

import BooksGrid from '@/components/booksGrid/BooksGrid';
import { getServerSession } from '@/lib/auth/serverAuth';
import { getBooksBySubjectId } from '@/lib/repositories/bookRepository';
import { getSubjectById } from '@/lib/repositories/subjectRepository';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

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

    const session = await getServerSession();
    const user = session ? await getUserByFirebaseId(session.uid) : null;
    const books = await getBooksBySubjectId(id, user?.id);

    return <BooksGrid books={books} subject={subject} />;
}
