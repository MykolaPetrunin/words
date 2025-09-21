import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'sonner';

import I18nProvider from '@/lib/i18n/I18nProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

import AccountForm from '../AccountForm';

const updateMock = jest.fn(() => ({ unwrap: jest.fn().mockResolvedValue({}) }));
let isLoadingFlag = false;

jest.mock('@/lib/redux/api/userApi', () => {
    const actual = jest.requireActual('@/lib/redux/api/userApi');
    return {
        ...actual,
        useUpdateMeMutation: () => [updateMock, { isLoading: isLoadingFlag }]
    };
});

jest.mock('@/lib/auth/AuthContext', () => ({
    loadUserData: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

const Providers = ({ children }: { children: React.ReactNode }) => (
    <ReduxProvider>
        <I18nProvider initialLocale="uk">{children}</I18nProvider>
    </ReduxProvider>
);

const defaultInitialData = {
    firstName: 'John',
    lastName: 'Doe',
    locale: 'uk' as const
};

const defaultEmail = 'john@doe.com';

describe('AccountForm', () => {
    beforeEach(() => {
        updateMock.mockClear();
        isLoadingFlag = false;
        jest.clearAllMocks();
    });

    it('renders form with initial data', async () => {
        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        expect(screen.getByText('Акаунт')).toBeInTheDocument();
        expect(screen.getByText('Емейл')).toBeInTheDocument();
        expect(screen.getByText("Ім'я")).toBeInTheDocument();
        expect(screen.getByText('Прізвище')).toBeInTheDocument();
        expect(screen.getByText('Мова інтерфейсу')).toBeInTheDocument();

        // Перевіряємо початкові значення
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(screen.getByText('john@doe.com')).toBeInTheDocument();

        // Початково кнопки відключені (форма не dirty)
        expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Скасувати' })).toBeDisabled();
    });

    it('enables buttons on change and submits form with updated values', async () => {
        const user = userEvent.setup();
        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        const firstName = screen.getByLabelText("Ім'я");
        await user.clear(firstName);
        await user.type(firstName, 'Jack');

        // Перевіряємо, що кнопки стали активними (форма dirty)
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Зберегти' })).toBeEnabled();
            expect(screen.getByRole('button', { name: 'Скасувати' })).toBeEnabled();
        });

        // Сабмітимо форму
        await user.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(updateMock).toHaveBeenCalledWith({ firstName: 'Jack', lastName: 'Doe', locale: 'uk' });
        });
    });

    it('cancels changes and resets form to original values', async () => {
        const user = userEvent.setup();
        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        const firstName = screen.getByLabelText("Ім'я");
        await user.clear(firstName);
        await user.type(firstName, 'Jack');

        // Перевіряємо, що кнопки активні
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Скасувати' })).toBeEnabled();
        });

        // Скасовуємо зміни
        await user.click(screen.getByRole('button', { name: 'Скасувати' }));

        // Перевіряємо, що значення повернулися до початкових
        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
            expect(screen.getByRole('button', { name: 'Скасувати' })).toBeDisabled();
        });
    });

    it('validates required fields and shows errors', async () => {
        const user = userEvent.setup();
        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        // Очищуємо обов'язкові поля
        const firstName = screen.getByLabelText("Ім'я");
        const lastName = screen.getByLabelText('Прізвище');

        await user.clear(firstName);
        await user.clear(lastName);

        // Спробуємо сабмітити форму з порожніми полями
        await user.click(screen.getByRole('button', { name: 'Зберегти' }));

        // Перевіряємо, що з'явилися помилки валідації
        await waitFor(() => {
            expect(screen.getByText('First name is required')).toBeInTheDocument();
            expect(screen.getByText('Last name is required')).toBeInTheDocument();
        });

        // Перевіряємо, що updateMock не викликався через помилки валідації
        expect(updateMock).not.toHaveBeenCalled();
    });

    it('changes locale and submits form', async () => {
        const user = userEvent.setup();
        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        const select = screen.getByLabelText('Мова інтерфейсу');
        await user.selectOptions(select, 'en');

        // Сабмітимо форму
        await user.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(updateMock).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe', locale: 'en' });
        });
    });

    it('disables buttons when isLoading true even if form is dirty', async () => {
        const user = userEvent.setup();
        isLoadingFlag = true;

        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        // Змінюємо поле
        const firstName = screen.getByLabelText("Ім'я");
        await user.clear(firstName);
        await user.type(firstName, 'Jack');

        // Перевіряємо, що кнопки все ще відключені через isLoading
        await waitFor(() => {
            const saveBtn = screen.getByRole('button', { name: 'Зберегти' });
            const cancelBtn = screen.getByRole('button', { name: 'Скасувати' });
            expect(saveBtn).toBeDisabled();
            expect(cancelBtn).toBeDisabled();
        });
    });

    it('shows success toast when update succeeds and resets form state', async () => {
        const user = userEvent.setup();
        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        const firstName = screen.getByLabelText("Ім'я");
        const saveButton = screen.getByRole('button', { name: 'Зберегти' });
        const cancelButton = screen.getByRole('button', { name: 'Скасувати' });

        await user.clear(firstName);
        await user.type(firstName, 'UpdatedName');

        expect(saveButton).not.toBeDisabled();
        expect(cancelButton).not.toBeDisabled();

        await user.click(saveButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Дані успішно збережено!');
            expect(saveButton).toBeDisabled();
            expect(cancelButton).toBeDisabled();
        });
    });

    it('shows error toast when update fails', async () => {
        const user = userEvent.setup();

        const originalUpdateMock = updateMock;
        updateMock.mockImplementationOnce(() => ({
            unwrap: jest.fn().mockRejectedValue(new Error('API Error'))
        }));

        render(<AccountForm initialData={defaultInitialData} email={defaultEmail} />, { wrapper: Providers });

        const firstName = screen.getByLabelText("Ім'я");
        await user.clear(firstName);
        await user.type(firstName, 'UpdatedName');

        await user.click(screen.getByRole('button', { name: 'Зберегти' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Не вдалося зберегти зміни. Спробуйте ще раз.');
        });

        updateMock.mockImplementation(originalUpdateMock);
    });
});
