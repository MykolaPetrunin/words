import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { useRouter } from 'next/navigation';

import { appPaths } from '@/lib/appPaths';
import { useAuth as useAuthOriginal } from '@/lib/auth/AuthContext';
// import I18nProvider from '@/lib/i18n/I18nProvider';
import { useAppSelector } from '@/lib/redux/ReduxProvider';

import { UserNav } from '../UserNav';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('@/lib/redux/ReduxProvider', () => {
    const actual = jest.requireActual('@/lib/redux/ReduxProvider');
    return {
        ...actual,
        useAppSelector: jest.fn(),
        default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    };
});

jest.mock('@/lib/i18n/I18nProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('lucide-react', () => ({
    BadgeCheck: () => <span>BadgeCheck</span>,
    ChevronsUpDown: ({ className }: { className?: string }) => <span className={className}>ChevronsUpDown</span>,
    LogOut: () => <span>LogOut</span>
}));

let __isMobile = false;
jest.mock('@/components/ui/sidebar', () => {
    interface Props {
        children?: React.ReactNode;
        side?: 'left' | 'right' | 'top' | 'bottom';
        className?: string;
        _size?: string;
        _asChild?: boolean;
    }

    return {
        SidebarTrigger: ({ children }: Props) => <button>{children}</button>,
        SidebarMenu: ({ children }: Props) => <div>{children}</div>,
        SidebarMenuItem: ({ children }: Props) => <div>{children}</div>,
        SidebarMenuButton: ({ children, className }: Props) => <button className={className}>{children}</button>,
        useSidebar: () => ({ isMobile: __isMobile })
    };
});

jest.mock('@/hooks/isMobile/useIsMobile', () => ({
    useIsMobile: () => __isMobile
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode; asChild?: boolean }) => <div>{children}</div>,
    DropdownMenuContent: ({ children, side }: { children: React.ReactNode; side?: string; className?: string; align?: string; sideOffset?: number }) => (
        <div data-side={side}>{children}</div>
    ),
    DropdownMenuItem: ({ children, onClick, onSelect }: { children: React.ReactNode; onClick?: () => void; onSelect?: (e: Event) => void; className?: string }) => (
        <button onClick={onClick} onMouseDown={(e) => onSelect?.(e as unknown as Event)}>
            {children}
        </button>
    ),
    DropdownMenuLabel: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
    DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />
}));

jest.mock('@/components/ui/avatar', () => ({
    Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => <div data-src={src} data-alt={alt} />,
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
    Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void; variant?: string; size?: string }) => <button onClick={onClick}>{children}</button>
}));

describe('UserNav', () => {
    const mockedUseAuth = useAuthOriginal as unknown as jest.MockedFunction<typeof useAuthOriginal>;
    const mockedUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;

    const Providers = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

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
        mockedUseAppSelector.mockReturnValue(null);

        const { container } = render(<UserNav />, { wrapper: Providers });
        expect(container.firstChild?.textContent).toBe('');
    });

    test('calls signOut and logs error when signOut rejects', async () => {
        const mockSignOut = jest.fn().mockRejectedValue(new Error('Sign out failed'));
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        __isMobile = false;
        const mockUser = {
            id: '1',
            firebaseId: 'firebase-1',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Roe',
            locale: 'uk',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        };
        mockedUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: mockSignOut
        });
        mockedUseAppSelector.mockReturnValue(mockUser);

        const errorSpy = jest.spyOn(console, 'error');

        render(<UserNav />, { wrapper: Providers });
        const exitButton = screen.getByText('auth.logout').closest('button')!;

        fireEvent.mouseDown(exitButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
        });

        errorSpy.mockRestore();
    });

    test('renders without secondaryText when email equals primaryText and shows initials fallback U', () => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        __isMobile = false;
        const mockUser = {
            id: '1',
            firebaseId: 'firebase-1',
            email: 'user@example.com',
            firstName: '',
            lastName: '',
            locale: 'uk',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        };
        mockedUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });
        mockedUseAppSelector.mockReturnValue(mockUser);

        const { container } = render(<UserNav />, { wrapper: Providers });
        expect(container.querySelector('.text-xs')).toBeNull();
        expect(screen.getAllByText('U')[0]).toBeInTheDocument();
    });

    test('uses bottom side on mobile', () => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        __isMobile = true;
        const mockUser = {
            id: '1',
            firebaseId: 'firebase-1',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Roe',
            locale: 'uk',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        };
        mockedUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });
        mockedUseAppSelector.mockReturnValue(mockUser);

        const { container } = render(<UserNav />, { wrapper: Providers });
        expect(container.querySelector('[data-side="bottom"]')).toBeInTheDocument();
    });

    test('navigates to account page on item select', async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });
        __isMobile = false;
        const mockUser = {
            id: '1',
            firebaseId: 'firebase-1',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Roe',
            locale: 'uk',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        };
        mockedUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });
        mockedUseAppSelector.mockReturnValue(mockUser);

        render(<UserNav />, { wrapper: Providers });

        const accountBtn = screen.getByText('account.title').closest('button')!;
        fireEvent.mouseDown(accountBtn);

        expect(push).toHaveBeenCalledWith(appPaths.account);
    });
});
