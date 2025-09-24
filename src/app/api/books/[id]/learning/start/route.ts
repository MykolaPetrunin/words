import { NextResponse } from 'next/server';

import { getServerSession } from '@/lib/auth/serverAuth';
import { serverLogger } from '@/lib/logger/serverLogger';
import { startLearningBook } from '@/lib/repositories/bookRepository';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(_request: Request, { params }: RouteParams): Promise<NextResponse> {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await getUserByFirebaseId(session.uid);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { id: bookId } = await params;
        const updatedBook = await startLearningBook(user.id, bookId);

        return NextResponse.json(updatedBook);
    } catch (error) {
        serverLogger.error('Failed to start learning book', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
