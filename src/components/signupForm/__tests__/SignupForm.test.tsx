import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/lib/auth/AuthContext';

import { SignupForm } from '../SignupForm';

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

describe('SignupForm', () => {
    const mockSignUp = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            signUp: mockSignUp
        });
    });

    it('should render signup form correctly', () => {
        render(<SignupForm />);

        expect(screen.getByText('Реєстрація')).toBeInTheDocument();
        expect(screen.getByText('Створіть новий акаунт для доступу до системи')).toBeInTheDocument();
        expect(screen.getByLabelText('Електронна пошта')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
        expect(screen.getByLabelText('Підтвердження пароля')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Зареєструватися' })).toBeInTheDocument();
        expect(screen.getByText('Увійти')).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Невірна електронна адреса')).toBeInTheDocument();
            expect(screen.getByText('Пароль має містити мінімум 6 символів')).toBeInTheDocument();
        });

        expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('should show validation error for short password', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');
        const confirmPasswordInput = screen.getByLabelText('Підтвердження пароля');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '12345');
        await user.type(confirmPasswordInput, '12345');

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Пароль має містити мінімум 6 символів')).toBeInTheDocument();
        });

        expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('should show validation error for password mismatch', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');
        const confirmPasswordInput = screen.getByLabelText('Підтвердження пароля');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password456');

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Паролі не співпадають')).toBeInTheDocument();
        });

        expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('should successfully submit form with valid data', async () => {
        const user = userEvent.setup();
        mockSignUp.mockResolvedValue(undefined);
        render(<SignupForm />);

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');
        const confirmPasswordInput = screen.getByLabelText('Підтвердження пароля');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(toast.success).toHaveBeenCalledWith('Реєстрація успішна!');
        });
    });

    it('should handle sign up error', async () => {
        const user = userEvent.setup();
        const mockError = new Error('Sign up failed');
        mockSignUp.mockRejectedValue(mockError);

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<SignupForm />);

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');
        const confirmPasswordInput = screen.getByLabelText('Підтвердження пароля');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(toast.error).toHaveBeenCalledWith('Помилка реєстрації. Можливо, цей email вже використовується.');
            expect(consoleError).toHaveBeenCalledWith(mockError);
        });

        consoleError.mockRestore();
    });

    it('should disable form during submission', async () => {
        const user = userEvent.setup();
        mockSignUp.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

        render(<SignupForm />);

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');
        const confirmPasswordInput = screen.getByLabelText('Підтвердження пароля');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        expect(screen.getByRole('button', { name: 'Реєстрація...' })).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(confirmPasswordInput).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Зареєструватися' })).toBeEnabled();
            expect(emailInput).toBeEnabled();
            expect(passwordInput).toBeEnabled();
            expect(confirmPasswordInput).toBeEnabled();
        });
    });

    it('should have a link to login page', () => {
        render(<SignupForm />);

        const loginLink = screen.getByText('Увійти');
        expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('should validate matching passwords in real-time', async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const emailInput = screen.getByLabelText('Електронна пошта');
        const passwordInput = screen.getByLabelText('Пароль');
        const confirmPasswordInput = screen.getByLabelText('Підтвердження пароля');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password456');

        const submitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Паролі не співпадають')).toBeInTheDocument();
        });

        await user.clear(confirmPasswordInput);
        await user.type(confirmPasswordInput, 'password123');

        const newSubmitButton = screen.getByRole('button', { name: 'Зареєструватися' });
        await user.click(newSubmitButton);

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });
});
