import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import React from 'react';

import { appPaths } from '@/lib/appPaths';

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

jest.mock('@/lib/auth/serverAuth', () => ({
    getServerSession: jest.fn().mockResolvedValue({ uid: '1', email: 'test@example.com', emailVerified: true })
}));

jest.mock('@/lib/repositories/userRepository', () => ({
    getUserByFirebaseId: jest.fn().mockResolvedValue({
        id: '1',
        firebaseId: 'firebase-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        questionsPerSession: 10,
        locale: 'uk',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z')
    })
}));

jest.mock('@/app/(protected)/ClientProtectedLayout', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div>
            <a href={appPaths.dashboard}>common.dashboard</a>
            {children}
        </div>
    )
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

jest.mock('@/lib/redux/ReduxProvider', () => {
    const actual = jest.requireActual('@/lib/redux/ReduxProvider');
    return {
        ...actual,
        useAppSelector: () => ({
            id: '1',
            firebaseId: 'firebase-1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            locale: 'uk',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        }),
        default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    };
});

jest.mock('@/lib/i18n/I18nProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
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

    it('should render children and sidebar', async () => {
        (usePathname as jest.Mock).mockReturnValue(appPaths.dashboard);

        const ui = await ProtectedLayout({
            children: <div>Test Content</div>
        } as { children: React.ReactNode });

        render(ui);

        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getAllByText('common.dashboard').length).toBeGreaterThan(0);
    });

    it('should include dashboard link', async () => {
        (usePathname as jest.Mock).mockReturnValue(appPaths.dashboard);

        const ui = await ProtectedLayout({
            children: <div>Test Content</div>
        } as { children: React.ReactNode });

        render(ui);

        const dashboardLinks = screen.getAllByRole('link', { name: 'common.dashboard' });
        const hasDashboardHref = dashboardLinks.some((a) => a.getAttribute('href') === appPaths.dashboard);
        expect(hasDashboardHref).toBe(true);
    });
});
