import { notFound } from 'next/navigation';
import React from 'react';

import { getServerSession } from '@/lib/auth/serverAuth';
import { getBookWithQuestions } from '@/lib/repositories/bookRepository';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

import BookPageClient from './BookPageClient';

interface BookPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BookPage({ params }: BookPageProps): Promise<React.ReactElement> {
    const { id } = await params;

    const session = await getServerSession();
    const user = session ? await getUserByFirebaseId(session.uid) : null;
    const book = await getBookWithQuestions(id, user?.id);

    if (!book) {
        notFound();
    }

    return <BookPageClient book={book} />;
}
