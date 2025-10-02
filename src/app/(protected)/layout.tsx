import React from 'react';
import { Toaster } from 'sonner';

import ClientProtectedLayout from '@/app/(protected)/ClientProtectedLayout';
import I18nProvider from '@/lib/i18n/I18nProvider';
import { getUserFromDB } from '@/lib/user/getUserFromDB';

import { AuthProvider } from '../../lib/auth/AuthContext';
import ReduxProvider from '../../lib/redux/ReduxProvider';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
    const initialUser = await getUserFromDB();

    return (
        <ReduxProvider initialUser={initialUser}>
            <AuthProvider>
                <I18nProvider initialLocale={initialUser?.locale || 'en'}>
                    <ClientProtectedLayout initialUser={initialUser}>{children}</ClientProtectedLayout>
                </I18nProvider>
                <Toaster />
            </AuthProvider>
        </ReduxProvider>
    );
}
