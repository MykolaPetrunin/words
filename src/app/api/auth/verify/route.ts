import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { verifySessionCookie } from '@/lib/firebase/firebaseAdmin';
import { serverLogger } from '@/lib/logger';

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        return NextResponse.json({ valid: false }, { status: 401 });
    }

    try {
        await verifySessionCookie(session);
        return NextResponse.json({ valid: true });
    } catch (error) {
        serverLogger.error('Session verify failed', error as Error, { endpoint: '/api/auth/verify' });
        cookieStore.set('session', '', {
            maxAge: 0,
            path: '/'
        });
        return NextResponse.json({ valid: false }, { status: 401 });
    }
}
