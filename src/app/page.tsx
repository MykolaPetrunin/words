import React from 'react';

import { Dashboard } from '@/components/dashboard/Dashboard';
import I18nProvider from '@/lib/i18n/I18nProvider';

import { AuthProvider } from '../lib/auth/AuthContext';
import ReduxProvider from '../lib/redux/ReduxProvider';

export default function Home(): React.ReactElement {
    return (
        <ReduxProvider>
            <AuthProvider>
                <I18nProvider initialLocale={'en'}>
                    <Dashboard />
                </I18nProvider>
            </AuthProvider>
        </ReduxProvider>
    );
}
