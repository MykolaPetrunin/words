import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createSessionCookie } from '@/lib/firebase/firebaseAdmin';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
        }

        const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
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
