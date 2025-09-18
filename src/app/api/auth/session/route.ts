import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createSessionCookie, getUserProfile, verifyIdToken } from '@/lib/firebase/firebaseAdmin';
import { upsertUserByFirebaseId } from '@/lib/repositories/userRepository';

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

        const cookieStore = await cookies();
        cookieStore.set('session', sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Session creation error:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
