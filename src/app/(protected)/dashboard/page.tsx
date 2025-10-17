import React from 'react';

import BooksGrid from '@/components/booksGrid/BooksGrid';
import { getServerSession } from '@/lib/auth/serverAuth';
import { getBooksBySubjectId } from '@/lib/repositories/bookRepository';
import { getAllActiveSubjects } from '@/lib/repositories/subjectRepository';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

export default async function DashboardPage(): Promise<React.ReactElement> {
    const subjects = await getAllActiveSubjects();

    if (subjects.length === 0) {
        return <BooksGrid books={[]} />;
    }

    const subject = subjects[0];
    const session = await getServerSession();
    const user = session ? await getUserByFirebaseId(session.uid) : null;
    const books = await getBooksBySubjectId(subject.id, user?.id);

    return <BooksGrid books={books} subject={subject} />;
}
