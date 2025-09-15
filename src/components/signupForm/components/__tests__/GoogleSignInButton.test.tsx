import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { useAuth } from '@/lib/auth/AuthContext';

import { GoogleSignInButton } from '../GoogleSignInButton';

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('GoogleSignInButton', () => {
    const mockSignInWithGoogle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            signInWithGoogle: mockSignInWithGoogle
        } as ReturnType<typeof useAuth>);
        console.error = jest.fn() as jest.MockedFunction<typeof console.error>;
    });

    it('should render with correct text', () => {
        render(<GoogleSignInButton />);

        expect(screen.getByText('Увійти через Google')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render as disabled when disabled prop is true', () => {
        render(<GoogleSignInButton disabled={true} />);

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should call signInWithGoogle when clicked', async () => {
        mockSignInWithGoogle.mockResolvedValue(undefined);

        render(<GoogleSignInButton />);

        fireEvent.click(screen.getByRole('button'));

        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('should show loading state while signing in', async () => {
        mockSignInWithGoogle.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(<GoogleSignInButton />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Увійти через Google...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText('Увійти через Google')).toBeInTheDocument();
        });
    });

    it('should show success toast on successful sign in', async () => {
        mockSignInWithGoogle.mockResolvedValue(undefined);

        render(<GoogleSignInButton />);

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Ви успішно увійшли через Google!');
        });
    });

    it('should show error toast and log error on failed sign in', async () => {
        const error = new Error('Sign in failed');
        mockSignInWithGoogle.mockRejectedValue(error);

        render(<GoogleSignInButton />);

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Помилка входу через Google. Спробуйте ще раз.');
            expect(console.error).toHaveBeenCalledWith('Google sign in error:', error);
        });
    });

    it('should not be disabled when loading is false and disabled prop is false', () => {
        render(<GoogleSignInButton disabled={false} />);

        expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('should be disabled when both loading and disabled prop are true', async () => {
        mockSignInWithGoogle.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(<GoogleSignInButton disabled={true} />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByRole('button')).toBeDisabled();
    });
});
