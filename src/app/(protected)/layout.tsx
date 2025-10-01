import React from 'react';

import ClientProtectedLayout from '@/app/(protected)/ClientProtectedLayout';
import { getUserFromDB } from '@/lib/user/getUserFromDB';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
    const initialUser = await getUserFromDB();

    return <ClientProtectedLayout initialUser={initialUser}>{children}</ClientProtectedLayout>;
}
