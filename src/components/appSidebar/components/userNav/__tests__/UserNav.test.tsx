import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { useAuth as useAuthOriginal } from '@/lib/auth/AuthContext';

import { UserNav } from '../UserNav';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

let __isMobile = false;
jest.mock('@/components/ui/sidebar', () => {
    interface Props {
        children?: React.ReactNode;
    }
    const useSidebar = () => ({ isMobile: __isMobile });
    const SidebarMenu: React.FC<Props> = ({ children }) => <div>{children}</div>;
    const SidebarMenuItem: React.FC<Props> = ({ children }) => <div>{children}</div>;
    const SidebarMenuButton: React.FC<Props & { size?: string; className?: string }> = ({ children }) => <button type="button">{children}</button>;
    return { useSidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton };
});

jest.mock('@/components/ui/dropdown-menu', () => {
    interface Props {
        children?: React.ReactNode;
    }
    interface ItemProps extends Props {
        onSelect?: (event: Event) => void;
        className?: string;
    }
    const DropdownMenu: React.FC<Props> = ({ children }) => <div>{children}</div>;
    const DropdownMenuTrigger: React.FC<Props & { asChild?: boolean }> = ({ children }) => <div>{children}</div>;
    const DropdownMenuContent: React.FC<Props & { className?: string; side?: string; align?: string; sideOffset?: number }> = ({ children, side }) => (
        <div data-side={side}>{children}</div>
    );
    const DropdownMenuGroup: React.FC<Props> = ({ children }) => <div>{children}</div>;
    const DropdownMenuItem: React.FC<ItemProps> = ({ children, onSelect }) => (
        <button type="button" onClick={(e) => onSelect?.(e.nativeEvent)}>
            {children}
        </button>
    );
    const DropdownMenuLabel: React.FC<Props & { className?: string }> = ({ children }) => <div>{children}</div>;
    const DropdownMenuSeparator: React.FC = () => <hr />;
    return {
        DropdownMenu,
        DropdownMenuTrigger,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator
    };
});

describe('UserNav', () => {
    const mockedUseAuth = useAuthOriginal as unknown as jest.MockedFunction<typeof useAuthOriginal>;

    test('returns null when user is null', () => {
        mockedUseAuth.mockReturnValue({
            user: null,
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });

        const { container } = render(<UserNav />);
        expect(container.firstChild).toBeNull();
    });

    test('calls signOut and logs error when signOut rejects', async () => {
        const signOutMock = jest.fn().mockRejectedValue(new Error('fail'));
        mockedUseAuth.mockReturnValue({
            user: {
                uid: '1',
                displayName: 'John Doe',
                email: 'jd@example.com',
                photoURL: null
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: signOutMock
        });

        const errorSpy = jest.spyOn(console, 'error');

        render(<UserNav />);
        const exitButton = screen.getByRole('button', { name: 'Вийти' });
        await userEvent.click(exitButton);

        await waitFor(() => expect(signOutMock).toHaveBeenCalled());
        expect(errorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));

        errorSpy.mockRestore();
    });

    test('renders without secondaryText when email equals primaryText and shows initials fallback U', () => {
        const signOutMock = jest.fn().mockResolvedValue(undefined);
        mockedUseAuth.mockReturnValue({
            user: {
                uid: '1',
                displayName: null,
                email: null,
                photoURL: null
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: signOutMock
        });

        const { container } = render(<UserNav />);
        expect(container.querySelector('.text-xs')).toBeNull();
        expect(screen.getAllByText('U')[0]).toBeInTheDocument();
    });

    test('uses bottom side on mobile', () => {
        __isMobile = true;
        mockedUseAuth.mockReturnValue({
            user: {
                uid: '1',
                displayName: 'Jane Roe',
                email: 'jane@example.com',
                photoURL: null
            },
            loading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signInWithGoogle: jest.fn(),
            signOut: jest.fn()
        });

        const { container } = render(<UserNav />);
        expect(container.querySelector('[data-side="bottom"]')).toBeInTheDocument();
    });
});
