import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { verifyIdToken } from '@/lib/firebase/firebaseAdmin';
import { getUserByFirebaseId, updateUser } from '@/lib/repositories/userRepository';
import type { ApiUser, UserLocale } from '@/lib/types/user';

const serialize = (user: NonNullable<Awaited<ReturnType<typeof getUserByFirebaseId>>>): ApiUser => {
    return {
        id: user.id,
        firebaseId: user.firebaseId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        questionsPerSession: user.questionsPerSession,
        locale: user.locale,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    };
};

export async function GET(): Promise<NextResponse> {
    const hdrs = await headers();
    const authHeader = hdrs.get('authorization') || hdrs.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decoded = await verifyIdToken(authHeader.replace('Bearer ', ''));
        const dbUser = await getUserByFirebaseId(decoded.uid);
        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const response = NextResponse.json(serialize(dbUser));
        response.headers.set('Content-Language', dbUser.locale);
        response.headers.set('Vary', 'Accept-Language, X-Locale');
        return response;
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const hdrs = await headers();
    const authHeader = hdrs.get('authorization') || hdrs.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { locale?: UserLocale; firstName?: string; lastName?: string; questionsPerSession?: number };
    const newLocale = body.locale;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const questionsPerSession = body.questionsPerSession;
    if (newLocale && newLocale !== 'uk' && newLocale !== 'en') {
        return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }
    if (questionsPerSession !== undefined && (typeof questionsPerSession !== 'number' || questionsPerSession < 1 || questionsPerSession > 50)) {
        return NextResponse.json({ error: 'Invalid questionsPerSession' }, { status: 400 });
    }

    try {
        const decoded = await verifyIdToken(authHeader.replace('Bearer ', ''));
        const updated = await updateUser(decoded.uid, { firstName, lastName, questionsPerSession, locale: newLocale });
        const response = NextResponse.json(serialize(updated));
        if (newLocale) {
            response.cookies.set('locale', newLocale, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: false,
                sameSite: 'lax',
                path: '/'
            });
            response.headers.set('Content-Language', newLocale);
        }
        response.headers.set('Vary', 'Accept-Language, X-Locale');
        return response;
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
