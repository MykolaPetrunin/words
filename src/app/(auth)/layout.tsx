import React from 'react';
import { Toaster } from 'sonner';

import { AuthProvider } from '../../lib/auth/AuthContext';
import I18nProvider from '../../lib/i18n/I18nProvider';
import ReduxProvider from '../../lib/redux/ReduxProvider';

export default function AuthLayout({ children }: { children: React.ReactNode }): React.ReactElement {
    return (
        <ReduxProvider>
            <AuthProvider>
                <I18nProvider initialLocale={'en'}>{children}</I18nProvider>
                <Toaster />
            </AuthProvider>
        </ReduxProvider>
    );
}
