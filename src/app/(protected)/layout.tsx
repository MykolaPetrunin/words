import React from 'react';

import ClientProtectedLayout from '@/app/(protected)/ClientProtectedLayout';
import { getServerSession } from '@/lib/auth/serverAuth';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';
import type { ApiUser } from '@/lib/types/user';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
    const session = await getServerSession();

    let initialUser: ApiUser | null = null;
    if (session?.uid) {
        const dbUser = await getUserByFirebaseId(session.uid);
        if (dbUser) {
            initialUser = {
                id: dbUser.id,
                firebaseId: dbUser.firebaseId,
                email: dbUser.email,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                questionsPerSession: dbUser.questionsPerSession,
                locale: dbUser.locale,
                createdAt: dbUser.createdAt.toISOString(),
                updatedAt: dbUser.updatedAt.toISOString()
            };
        }
    }

    return <ClientProtectedLayout initialUser={initialUser}>{children}</ClientProtectedLayout>;
}
