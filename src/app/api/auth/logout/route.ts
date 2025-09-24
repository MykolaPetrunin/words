import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { serverLogger } from '@/lib/logger';

export async function POST(): Promise<NextResponse> {
    try {
        const cookieStore = await cookies();
        cookieStore.set('session', '', {
            maxAge: 0,
            path: '/'
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        serverLogger.error('Logout failed', error as Error, { endpoint: '/api/auth/logout' });
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
