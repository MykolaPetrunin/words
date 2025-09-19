import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { appPaths } from '@/lib/appPaths';
import { verifySessionCookie } from '@/lib/firebase/firebaseAdmin';

export interface SessionUser {
    uid: string;
    email?: string;
    emailVerified?: boolean;
}

export async function getServerSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        return null;
    }

    try {
        const decodedClaims = await verifySessionCookie(session);
        return {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            emailVerified: decodedClaims.emailVerified
        };
    } catch (error) {
        console.error('Invalid session:', error);
        return null;
    }
}

export async function requireAuth(): Promise<SessionUser> {
    const session = await getServerSession();

    if (!session) {
        redirect(appPaths.login);
    }

    return session;
}
