import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/lib/auth/AuthContext';
import I18nProvider from '@/lib/i18n/I18nProvider';
import { clientLogger } from '@/lib/logger';
import ReduxProvider from '@/lib/redux/ReduxProvider';

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

jest.mock('@/lib/logger', () => ({
    clientLogger: {
        error: jest.fn()
    }
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('GoogleSignInButton', () => {
    const mockSignInWithGoogle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            signInWithGoogle: mockSignInWithGoogle
        } as ReturnType<typeof useAuth>);
    });

    const Providers = ({ children }: { children: React.ReactNode }) => (
        <ReduxProvider>
            <I18nProvider initialLocale="uk">{children}</I18nProvider>
        </ReduxProvider>
    );

    it('should render with correct text', () => {
        render(<GoogleSignInButton />, { wrapper: Providers });

        expect(screen.getByText('Увійти через Google')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render as disabled when disabled prop is true', () => {
        render(<GoogleSignInButton disabled={true} />, { wrapper: Providers });

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should call signInWithGoogle when clicked', async () => {
        mockSignInWithGoogle.mockResolvedValue(undefined);

        render(<GoogleSignInButton />, { wrapper: Providers });

        fireEvent.click(screen.getByRole('button'));

        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('should show loading state while signing in', async () => {
        mockSignInWithGoogle.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(<GoogleSignInButton />, { wrapper: Providers });

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Увійти через Google...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText('Увійти через Google')).toBeInTheDocument();
        });
    });

    it('should show success toast on successful sign in', async () => {
        mockSignInWithGoogle.mockResolvedValue(undefined);

        render(<GoogleSignInButton />, { wrapper: Providers });

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Ви успішно увійшли через Google!');
        });
    });

    it('should show error toast and log error on failed sign in', async () => {
        const error = new Error('Sign in failed');
        mockSignInWithGoogle.mockRejectedValue(error);

        render(<GoogleSignInButton />, { wrapper: Providers });

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Помилка входу через Google. Спробуйте ще раз.');
            expect(clientLogger.error).toHaveBeenCalledWith('Google sign in from button failed', error);
        });
    });

    it('should not be disabled when loading is false and disabled prop is false', () => {
        render(<GoogleSignInButton disabled={false} />, { wrapper: Providers });

        expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('should be disabled when both loading and disabled prop are true', async () => {
        mockSignInWithGoogle.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(<GoogleSignInButton disabled={true} />, { wrapper: Providers });

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByRole('button')).toBeDisabled();
    });
});
