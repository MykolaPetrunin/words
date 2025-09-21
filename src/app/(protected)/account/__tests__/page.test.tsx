import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import AccountPage from '@/app/(protected)/account/page';
import I18nProvider from '@/lib/i18n/I18nProvider';
import ReduxProvider, { store } from '@/lib/redux/ReduxProvider';
import { setUser } from '@/lib/redux/slices/currentUserSlice';

jest.mock('next/link', () => {
    const MockLink = ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
        <a href={href} className={className}>
            {children}
        </a>
    );
    MockLink.displayName = 'MockLink';
    return MockLink;
});

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() })
}));

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn(() => ({ user: { uid: '1', email: 'u@e.com', displayName: 'U', photoURL: null }, loading: false }))
}));

const updateMock = jest.fn(() => ({ unwrap: jest.fn().mockResolvedValue({}) }));
let meData: { firstName?: string; lastName?: string; email?: string; locale?: 'uk' | 'en' } | undefined = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    locale: 'uk'
};
let isLoadingFlag = false;
jest.mock('@/lib/redux/api/userApi', () => {
    const actual = jest.requireActual('@/lib/redux/api/userApi');
    return {
        ...actual,
        useGetMeQuery: () => ({ data: meData }),
        useUpdateMeMutation: () => [updateMock, { isLoading: isLoadingFlag }]
    };
});

const Providers = ({ children }: { children: React.ReactNode }) => (
    <ReduxProvider>
        <I18nProvider initialLocale="uk">{children}</I18nProvider>
    </ReduxProvider>
);

describe('AccountPage', () => {
    it('renders fields and allows editing state', async () => {
        render(<AccountPage />, { wrapper: Providers });

        expect(screen.getByText('Акаунт')).toBeInTheDocument();
        expect(screen.getByText('Емейл')).toBeInTheDocument();
        expect(screen.getByText("Ім'я")).toBeInTheDocument();
        expect(screen.getByText('Прізвище')).toBeInTheDocument();
        expect(screen.getByText('Мова інтерфейсу')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Скасувати' })).toBeDisabled();
    });

    it('enables buttons on change and saves names', async () => {
        render(<AccountPage />, { wrapper: Providers });

        const firstName = screen.getByDisplayValue('John');
        fireEvent.change(firstName, { target: { value: 'Jack' } });

        const saveBtn = screen.getByRole('button', { name: 'Зберегти' });
        expect(saveBtn).toBeEnabled();

        fireEvent.click(saveBtn);

        await waitFor(() => expect(updateMock).toHaveBeenCalledWith({ firstName: 'Jack', lastName: 'Doe', locale: 'uk' }));
    });

    it('cancels changes and disables buttons back', async () => {
        render(<AccountPage />, { wrapper: Providers });

        const firstName = screen.getByDisplayValue('John');
        fireEvent.change(firstName, { target: { value: 'Jack' } });

        const cancelBtn = screen.getByRole('button', { name: 'Скасувати' });
        expect(cancelBtn).toBeEnabled();
        fireEvent.click(cancelBtn);

        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
        expect(cancelBtn).toBeDisabled();
    });

    it('changes locale and saves', async () => {
        render(<AccountPage />, { wrapper: Providers });

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'en' } });

        const saveBtn = screen.getByRole('button', { name: 'Зберегти' });
        fireEvent.click(saveBtn);

        await waitFor(() => expect(updateMock).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe', locale: 'en' }));
    });

    it('initializes fields from redux user when present', () => {
        store.dispatch(
            setUser({
                id: 'id1',
                firebaseId: 'fb1',
                email: 'x@y.com',
                firstName: 'R',
                lastName: 'S',
                locale: 'uk',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            })
        );

        const { getByDisplayValue, getByText } = render(<AccountPage />, { wrapper: Providers });
        expect(getByDisplayValue('R')).toBeInTheDocument();
        expect(getByDisplayValue('S')).toBeInTheDocument();
        expect(getByText('x@y.com')).toBeInTheDocument();
    });

    it('returns null when no user in context', async () => {
        const { useAuth } = await import('@/lib/auth/AuthContext');
        (useAuth as jest.Mock).mockReturnValueOnce({ user: null, loading: false });
        const { container } = render(<AccountPage />, { wrapper: Providers });
        expect(container.firstChild).toBeNull();
    });

    it('changes lastName and sets dirty branch', async () => {
        store.dispatch(
            setUser({
                id: 'id2',
                firebaseId: 'fb2',
                email: 'john@doe.com',
                firstName: 'John',
                lastName: 'Doe',
                locale: 'uk',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            })
        );
        render(<AccountPage />, { wrapper: Providers });

        const lastName = screen.getByDisplayValue('Doe');
        fireEvent.change(lastName, { target: { value: 'Smith' } });

        const saveBtn = screen.getByRole('button', { name: 'Зберегти' });
        expect(saveBtn).toBeEnabled();

        fireEvent.click(saveBtn);
        await waitFor(() => expect(updateMock).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Smith', locale: 'uk' }));
    });

    it('selects uk branch in locale selector', () => {
        render(<AccountPage />, { wrapper: Providers });
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'uk' } });
        expect(select.value).toBe('uk');
    });

    it('defaults to empty values when no redux user and no me', () => {
        store.dispatch(setUser(null));
        meData = { firstName: '', lastName: '', email: '', locale: 'uk' };
        render(<AccountPage />, { wrapper: Providers });
        const emailDiv = screen.getByText('Емейл').nextSibling as HTMLElement;
        expect(emailDiv).toBeEmptyDOMElement();
        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('uk');
        meData = { firstName: 'John', lastName: 'Doe', email: 'john@doe.com', locale: 'uk' };
    });

    it('disables buttons when isLoading true even if dirty', () => {
        isLoadingFlag = true;
        render(<AccountPage />, { wrapper: Providers });
        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
        fireEvent.change(inputs[0], { target: { value: 'Jack' } });
        const saveBtn = screen.getByRole('button', { name: 'Зберегти' });
        const cancelBtn = screen.getByRole('button', { name: 'Скасувати' });
        expect(saveBtn).toBeDisabled();
        expect(cancelBtn).toBeDisabled();
        isLoadingFlag = false;
    });

    it('uses fallback values when both reduxUser and me are null/undefined', () => {
        store.dispatch(setUser(null));
        meData = undefined;
        render(<AccountPage />, { wrapper: Providers });

        // Перевіряємо fallback значення в полях
        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
        expect(inputs[0].value).toBe(''); // firstName fallback
        expect(inputs[1].value).toBe(''); // lastName fallback

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('uk'); // locale fallback

        // Перевіряємо fallback в email (порожній текст)
        const emailDiv = screen.getByText('Емейл').nextSibling as HTMLElement;
        expect(emailDiv.textContent).toBe('');

        // Тестуємо handleCancel з fallback значеннями
        fireEvent.change(inputs[0], { target: { value: 'Test' } });
        const cancelBtn = screen.getByRole('button', { name: 'Скасувати' });
        fireEvent.click(cancelBtn);

        // Після cancel повинні повернутися fallback значення
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
        expect(select.value).toBe('uk');

        // Відновлюємо дані для інших тестів
        meData = { firstName: 'John', lastName: 'Doe', email: 'john@doe.com', locale: 'uk' };
    });
});
