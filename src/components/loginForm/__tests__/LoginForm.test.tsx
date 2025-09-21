import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'sonner';

import { appPaths } from '@/lib/appPaths';
import { useAuth } from '@/lib/auth/AuthContext';
import I18nProvider from '@/lib/i18n/I18nProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

import { LoginForm } from '../LoginForm';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

jest.mock('next/link', () => {
    const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
    MockLink.displayName = 'MockLink';
    return MockLink;
});

describe('LoginForm', () => {
    const mockSignIn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            signIn: mockSignIn
        });
    });

    const Providers = ({ children }: { children: React.ReactNode }) => (
        <ReduxProvider>
            <I18nProvider initialLocale="uk">{children}</I18nProvider>
        </ReduxProvider>
    );

    it('should render login form correctly', () => {
        render(<LoginForm />, { wrapper: Providers });

        expect(screen.getByText('Вхід')).toBeInTheDocument();
        expect(screen.getByText('Введіть свої дані для входу в систему')).toBeInTheDocument();
        expect(screen.getByLabelText('Електронна пошта')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Увійти' })).toBeInTheDocument();
        expect(screen.getByText('Зареєструватися')).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
        const user = userEvent.setup();
        render(<LoginForm />, { wrapper: Providers });

        const submitButton = screen.getByRole('button', { name: 'Увійти' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Невірна електронна адреса')).toBeInTheDocument();
            expect(screen.getByText('Пароль має містити мінімум 6 символів')).toBeInTheDocument();
        });

        expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('should show validation error for short password', async () => {
        const user = userEvent.setup();
        render(<LoginForm />, { wrapper: Providers });

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '12345');

        const submitButton = screen.getByRole('button', { name: 'Увійти' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Пароль має містити мінімум 6 символів')).toBeInTheDocument();
        });

        expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('should successfully submit form with valid data', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValue(undefined);
        render(<LoginForm />, { wrapper: Providers });

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: 'Увійти' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(toast.success).toHaveBeenCalledWith('Ви успішно увійшли!');
        });
    });

    it('should handle sign in error', async () => {
        const user = userEvent.setup();
        const mockError = new Error('Sign in failed');
        mockSignIn.mockRejectedValue(mockError);

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<LoginForm />, { wrapper: Providers });

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: 'Увійти' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(toast.error).toHaveBeenCalledWith('Помилка входу. Перевірте дані та спробуйте ще раз.');
            expect(consoleError).toHaveBeenCalledWith(mockError);
        });

        consoleError.mockRestore();
    });

    it('should disable form during submission', async () => {
        const user = userEvent.setup();
        mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(<LoginForm />, { wrapper: Providers });

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: 'Увійти' });
        await user.click(submitButton);

        expect(screen.getByRole('button', { name: 'Вхід...' })).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Увійти' })).toBeEnabled();
            expect(emailInput).toBeEnabled();
            expect(passwordInput).toBeEnabled();
        });
    });

    it('should have a link to signup page', () => {
        render(<LoginForm />, { wrapper: Providers });

        const signupLink = screen.getByText('Зареєструватися');
        expect(signupLink).toHaveAttribute('href', appPaths.signup);
    });

    it('should clear form errors when user starts typing', async () => {
        const user = userEvent.setup();
        render(<LoginForm />, { wrapper: Providers });

        const submitButton = screen.getByRole('button', { name: 'Увійти' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Невірна електронна адреса')).toBeInTheDocument();
        });

        const emailInput = screen.getByLabelText('Електронна пошта');
        await user.clear(emailInput);
        await user.type(emailInput, 'test@example.com');

        await waitFor(
            () => {
                expect(screen.queryByText('Невірна електронна адреса')).not.toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });
});
