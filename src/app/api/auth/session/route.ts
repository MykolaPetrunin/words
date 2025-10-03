import { NextRequest, NextResponse } from 'next/server';

import { createSessionCookie, getUserProfile, verifyIdToken } from '@/lib/firebase/firebaseAdmin';
import { serverLogger } from '@/lib/logger';
import { getUserByFirebaseId, upsertUserByFirebaseId } from '@/lib/repositories/userRepository';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { idToken } = (await request.json()) as { idToken?: string };

        if (!idToken) {
            return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
        }

        const decoded = await verifyIdToken(idToken);

        if (!decoded.uid) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const profile = await getUserProfile(decoded.uid);
        const email = decoded.email || profile.email;
        if (!email) {
            return NextResponse.json({ error: 'Email not found in token' }, { status: 400 });
        }

        const displayName = profile.displayName || '';
        const parts = displayName.trim().split(/\s+/).filter(Boolean);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        await upsertUserByFirebaseId({ firebaseId: decoded.uid, email, firstName, lastName });

        const expiresIn = 60 * 60 * 24 * 14 * 1000;
        const sessionCookie = await createSessionCookie(idToken, expiresIn);

        const response = NextResponse.json({ success: true });
        response.cookies.set('session', sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        const dbUser = await getUserByFirebaseId(decoded.uid);
        console.info('Session creation route: dbUser:', dbUser);
        if (dbUser) {
            response.cookies.set('locale', dbUser.locale, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: false,
                sameSite: 'lax',
                path: '/'
            });
            response.cookies.set('role', dbUser.role, {
                maxAge: expiresIn,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
        }

        return response;
    } catch (error) {
        console.error('Session creation failed', error);
        serverLogger.error('Session creation failed', error as Error, { endpoint: '/api/auth/session' });
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
