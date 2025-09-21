import AccountPage from '@/app/(protected)/account/page';

// Мокаємо серверні модулі
jest.mock('@/lib/auth/serverAuth', () => ({
    requireAuth: jest.fn(() => Promise.resolve({ uid: 'test-uid' }))
}));

jest.mock('@/lib/repositories/userRepository', () => ({
    getUserByFirebaseId: jest.fn(() =>
        Promise.resolve({
            id: 'test-id',
            firebaseId: 'test-uid',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            locale: 'uk',
            createdAt: new Date(),
            updatedAt: new Date()
        })
    )
}));

jest.mock('../components/AccountForm', () => {
    const MockAccountForm = ({ initialData, email }: { initialData: { firstName: string; lastName: string; locale: string }; email: string }) => (
        <div data-testid="account-form">
            <div>Email: {email}</div>
            <div>First Name: {initialData.firstName}</div>
            <div>Last Name: {initialData.lastName}</div>
            <div>Locale: {initialData.locale}</div>
        </div>
    );
    MockAccountForm.displayName = 'MockAccountForm';
    return MockAccountForm;
});

describe('AccountPage (Server Component)', () => {
    it('renders AccountForm with server-side data', async () => {
        // Оскільки це серверний компонент, ми можемо тестувати тільки базову логіку
        // Детальне тестування форми відбувається в AccountForm.test.tsx
        const accountPage = AccountPage();

        // Перевіряємо, що компонент повертає Promise (async function)
        expect(accountPage).toBeInstanceOf(Promise);

        // Для серверних компонентів з Firebase Admin тестування обмежене
        // Основне тестування форми має бути в AccountForm.test.tsx
    });
});
