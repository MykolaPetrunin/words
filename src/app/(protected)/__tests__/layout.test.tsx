import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import React from 'react';

import { appPaths } from '@/lib/appPaths';
import I18nProvider from '@/lib/i18n/I18nProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

import ProtectedLayout from '../layout';

jest.mock('@/lib/firebase/firebaseClient', () => ({
    auth: {},
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    onAuthStateChange: (cb: (u: unknown) => void) => {
        cb(null);
        return () => {};
    }
}));

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() })
}));

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: () => ({
        user: { uid: '1', email: 'test@example.com', displayName: 'Test User', photoURL: null },
        loading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signInWithGoogle: jest.fn(),
        signOut: jest.fn()
    })
}));

jest.mock('next/link', () => {
    const MockedLink = ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
        <a href={href} className={className}>
            {children}
        </a>
    );
    MockedLink.displayName = 'MockedLink';
    return MockedLink;
});

describe('ProtectedLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render children and sidebar', () => {
        (usePathname as jest.Mock).mockReturnValue(appPaths.dashboard);

        render(
            <ReduxProvider>
                <I18nProvider initialLocale="uk">
                    <ProtectedLayout>
                        <div>Test Content</div>
                    </ProtectedLayout>
                </I18nProvider>
            </ReduxProvider>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    });

    it('should include dashboard link', () => {
        (usePathname as jest.Mock).mockReturnValue(appPaths.dashboard);

        render(
            <ReduxProvider>
                <I18nProvider initialLocale="uk">
                    <ProtectedLayout>
                        <div>Test Content</div>
                    </ProtectedLayout>
                </I18nProvider>
            </ReduxProvider>
        );

        const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' });
        const hasDashboardHref = dashboardLinks.some((a) => a.getAttribute('href') === appPaths.dashboard);
        expect(hasDashboardHref).toBe(true);
    });
});
