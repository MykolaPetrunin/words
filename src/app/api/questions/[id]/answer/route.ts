import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/lib/auth/serverAuth';
import { serverLogger } from '@/lib/logger';
import { upsertUserQuestionScore } from '@/lib/repositories/userQuestionScoreRepository';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

interface AnswerQuestionRequest {
    isCorrect: boolean;
}

export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await getUserByFirebaseId(session.uid);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { id: questionId } = await params;
        const { isCorrect } = (await request.json()) as AnswerQuestionRequest;

        if (typeof isCorrect !== 'boolean') {
            return NextResponse.json({ error: 'Invalid isCorrect value' }, { status: 400 });
        }

        // Update user question score
        const updatedScore = await upsertUserQuestionScore({
            userId: user.id,
            questionId,
            isCorrectAnswer: isCorrect
        });

        return NextResponse.json({
            success: true,
            score: updatedScore.score
        });
    } catch (error) {
        serverLogger.error('Failed to process question answer', error as Error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
