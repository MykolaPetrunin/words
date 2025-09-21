import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useRouter } from 'next/navigation';

import { appPaths } from '@/lib/appPaths';
import { useAuth as useAuthOriginal } from '@/lib/auth/AuthContext';
import I18nProvider from '@/lib/i18n/I18nProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

import { UserNav } from '../UserNav';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

let __isMobile = false;
jest.mock('@/components/ui/sidebar', () => {
    interface Props {
        children?: React.ReactNode;
        side?: 'left' | 'right' | 'top' | 'bottom';
    }

    return {
        SidebarTrigger: ({ children }: Props) => <button>{children}</button>,
        SidebarMenuButton: ({ children }: Props) => <button>{children}</button>,
        useSidebar: () => ({ isMobile: __isMobile })
    };
});

jest.mock('@/hooks/isMobile/useIsMobile', () => ({
    useIsMobile: () => __isMobile
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuContent: ({ children, side }: { children: React.ReactNode; side?: string }) => <div data-side={side}>{children}</div>,
    DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => <button onClick={onClick}>{children}</button>,
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />
}));

jest.mock('@/components/ui/avatar', () => ({
    Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => <img src={src} alt={alt} />,
    AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/components/ui/skeleton', () => ({
    Skeleton: ({ className }: { className?: string }) => <div className={className}>Loading...</div>
}));

jest.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void; variant?: string; size?: string }) => (
        <button onClick={onClick}>{children}</button>
    )
}));

describe('UserNav', () => {
    const mockedUseAuth = useAuthOriginal as unknown as jest.MockedFunction<typeof useAuthOriginal>;

    const Providers = ({ children }: { children: React.ReactNode }) => (
        <ReduxProvider>
            <I18nProvider initialLocale="uk">{children}</I18nProvider>
        </ReduxProvider>
    );

    test('returns null when user is null', () => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        mockedUseAuth.mockReturnValue({
            user: null,
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });

        const { container } = render(<UserNav />, { wrapper: Providers });
        expect(container.firstChild).toBeNull();
    });

    test('calls signOut and logs error when signOut rejects', async () => {
        const mockSignOut = jest.fn().mockRejectedValue(new Error('Sign out failed'));
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        __isMobile = false;
        mockedUseAuth.mockReturnValue({
            user: {
                id: '1',
                firebaseId: 'firebase-1',
                email: 'jane@example.com',
                firstName: 'Jane',
                lastName: 'Roe',
                locale: 'uk',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: mockSignOut
        });

        const errorSpy = jest.spyOn(console, 'error');

        render(<UserNav />, { wrapper: Providers });
        const exitButton = screen.getByRole('button', { name: 'Вийти' });
        await userEvent.click(exitButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
        });

        errorSpy.mockRestore();
    });

    test('renders without secondaryText when email equals primaryText and shows initials fallback U', () => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        __isMobile = false;
        mockedUseAuth.mockReturnValue({
            user: {
                id: '1',
                firebaseId: 'firebase-1',
                email: 'user@example.com',
                firstName: '',
                lastName: '',
                locale: 'uk',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });

        const { container } = render(<UserNav />, { wrapper: Providers });
        expect(container.querySelector('.text-xs')).toBeNull();
        expect(screen.getAllByText('U')[0]).toBeInTheDocument();
    });

    test('uses bottom side on mobile', () => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        __isMobile = true;
        mockedUseAuth.mockReturnValue({
            user: {
                id: '1',
                firebaseId: 'firebase-1',
                email: 'jane@example.com',
                firstName: 'Jane',
                lastName: 'Roe',
                locale: 'uk',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });

        const { container } = render(<UserNav />, { wrapper: Providers });
        expect(container.querySelector('[data-side="bottom"]')).toBeInTheDocument();
    });

    test('navigates to account page on item select', async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });
        __isMobile = false;
        mockedUseAuth.mockReturnValue({
            user: {
                id: '1',
                firebaseId: 'firebase-1',
                email: 'jane@example.com',
                firstName: 'Jane',
                lastName: 'Roe',
                locale: 'uk',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });

        render(<UserNav />, { wrapper: Providers });

        const accountBtn = screen.getByRole('button', { name: 'Акаунт' });
        await userEvent.click(accountBtn);

        expect(push).toHaveBeenCalledWith(appPaths.account);
    });
});
