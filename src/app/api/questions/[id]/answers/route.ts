import { NextResponse } from 'next/server';

import { getServerSession } from '@/lib/auth/serverAuth';
import { serverLogger } from '@/lib/logger/serverLogger';
import { getAnswersByQuestionId } from '@/lib/repositories/questionRepository';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(_req: Request, { params }: RouteParams): Promise<NextResponse> {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const answers = await getAnswersByQuestionId(id);
        return NextResponse.json(answers);
    } catch (error) {
        serverLogger.error('Failed to fetch answers by question id', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
