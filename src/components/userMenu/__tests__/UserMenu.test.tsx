import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UserMenu } from '@/components/userMenu/UserMenu';
import { useAuth } from '@/lib/auth/AuthContext';
import { User } from '@/lib/types/auth';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

describe('UserMenu', () => {
    const mockSignOut = jest.fn();
    const mockUser: User = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when user is not authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: null,
            signOut: mockSignOut
        });

        const { container } = render(<UserMenu />);

        expect(container.firstChild).toBeNull();
    });

    it('should render user menu when authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        expect(menuButton).toBeInTheDocument();
        expect(screen.getByTestId('lucide-user-circle')).toBeInTheDocument();
    });

    it('should display user email in dropdown', async () => {
        const user = userEvent.setup();
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        await user.click(menuButton);

        expect(screen.getByText('Мій акаунт')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display sign out option', async () => {
        const user = userEvent.setup();
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        await user.click(menuButton);

        expect(screen.getByText('Вийти')).toBeInTheDocument();
        expect(screen.getByTestId('lucide-log-out')).toBeInTheDocument();
    });

    it('should handle sign out successfully', async () => {
        const user = userEvent.setup();
        mockSignOut.mockResolvedValue(undefined);
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        await user.click(menuButton);

        const signOutButton = screen.getByText('Вийти');
        await user.click(signOutButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
        });
    });

    it('should handle sign out error', async () => {
        const user = userEvent.setup();
        const mockError = new Error('Sign out failed');
        mockSignOut.mockRejectedValue(mockError);

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        await user.click(menuButton);

        const signOutButton = screen.getByText('Вийти');
        await user.click(signOutButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
            expect(consoleError).toHaveBeenCalledWith('Error signing out:', mockError);
        });

        consoleError.mockRestore();
    });

    it('should close dropdown after clicking sign out', async () => {
        const user = userEvent.setup();
        mockSignOut.mockResolvedValue(undefined);
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        await user.click(menuButton);

        const signOutButton = screen.getByText('Вийти');
        await user.click(signOutButton);

        await waitFor(() => {
            expect(screen.queryByText('Мій акаунт')).not.toBeInTheDocument();
        });
    });

    it('should apply correct styles to components', async () => {
        const user = userEvent.setup();
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        expect(menuButton).toHaveClass('relative', 'h-8', 'w-8', 'rounded-full');

        await user.click(menuButton);

        const signOutMenuItem = screen.getByText('Вийти').closest('div');
        expect(signOutMenuItem).toHaveClass('cursor-pointer', 'text-red-600', 'focus:text-red-600');
    });

    it('should handle user with null displayName and photoURL', () => {
        const userWithNulls: User = {
            uid: 'test-uid',
            email: 'test@example.com',
            displayName: null,
            photoURL: null
        };

        (useAuth as jest.Mock).mockReturnValue({
            user: userWithNulls,
            signOut: mockSignOut
        });

        render(<UserMenu />);

        const menuButton = screen.getByRole('button');
        expect(menuButton).toBeInTheDocument();
    });
});
