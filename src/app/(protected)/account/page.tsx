import { redirect } from 'next/navigation';
import React from 'react';

import { appPaths } from '@/lib/appPaths';
import { requireAuth } from '@/lib/auth/serverAuth';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

import AccountForm from './components/AccountForm';

export const dynamic = 'force-dynamic';

export default async function AccountPage(): Promise<React.ReactElement> {
    const sessionUser = await requireAuth();

    const dbUser = await getUserByFirebaseId(sessionUser.uid);
    if (!dbUser) {
        redirect(appPaths.login);
    }

    const initialData = {
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        questionsPerSession: dbUser.questionsPerSession,
        locale: dbUser.locale
    };

    return <AccountForm initialData={initialData} email={dbUser.email} />;
}
