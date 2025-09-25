import { redirect } from 'next/navigation';

import AccountPage from '@/app/(protected)/account/page';

// Mock redirect
jest.mock('next/navigation', () => ({
    redirect: jest.fn(() => {
        throw new Error('NEXT_REDIRECT');
    })
}));

// Мокаємо серверні модулі
jest.mock('@/lib/auth/serverAuth', () => ({
    requireAuth: jest.fn(() => Promise.resolve({ uid: 'test-uid' }))
}));

jest.mock('@/lib/repositories/userRepository', () => ({
    getUserByFirebaseId: jest.fn()
}));

jest.mock('../components/AccountForm', () => {
    const MockAccountForm = ({
        initialData,
        email
    }: {
        initialData: { firstName: string; lastName: string; locale: string; questionsPerSession: number };
        email: string;
    }) => (
        <div data-testid="account-form">
            <div>Email: {email}</div>
            <div>First Name: {initialData.firstName}</div>
            <div>Last Name: {initialData.lastName}</div>
            <div>Locale: {initialData.locale}</div>
            <div>Questions: {initialData.questionsPerSession}</div>
        </div>
    );
    MockAccountForm.displayName = 'MockAccountForm';
    return MockAccountForm;
});

describe('AccountPage (Server Component)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders AccountForm with server-side data', async () => {
        const { getUserByFirebaseId } = jest.requireMock('@/lib/repositories/userRepository');
        getUserByFirebaseId.mockResolvedValueOnce({
            id: 'test-id',
            firebaseId: 'test-uid',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            questionsPerSession: 10,
            locale: 'uk',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const accountPage = AccountPage();

        // Перевіряємо, що компонент повертає Promise (async function)
        expect(accountPage).toBeInstanceOf(Promise);

        const result = await accountPage;
        expect(result).toBeTruthy();
        expect(getUserByFirebaseId).toHaveBeenCalledWith('test-uid');
    });

    it('redirects to login when user not found in database', async () => {
        const { getUserByFirebaseId } = jest.requireMock('@/lib/repositories/userRepository');
        getUserByFirebaseId.mockResolvedValueOnce(null);

        // redirect throws an error to stop execution in Next.js
        await expect(AccountPage()).rejects.toThrow();

        expect(redirect).toHaveBeenCalledWith('/login');
    });
});
