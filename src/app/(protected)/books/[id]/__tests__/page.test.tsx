import { render, screen } from '@testing-library/react';

import BookPage from '../page';

jest.mock('next/navigation', () => ({
    notFound: jest.fn()
}));

jest.mock('@/lib/auth/serverAuth', () => ({
    getServerSession: jest.fn().mockResolvedValue({ uid: 'firebase-user-id', email: 'test@test.com' })
}));

jest.mock('@/lib/repositories/userRepository', () => ({
    getUserByFirebaseId: jest.fn().mockResolvedValue({ id: 'user1', firebaseId: 'firebase-user-id', email: 'test@test.com' })
}));

jest.mock('@/lib/repositories/bookRepository', () => ({
    getBookWithQuestions: jest.fn()
}));

jest.mock('../BookPageClient', () => ({
    __esModule: true,
    default: ({ book }: { book: { titleUk: string } }) => <div data-testid="book-page-client">{book.titleUk}</div>
}));

describe('BookPage (Server Component)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders BookPageClient for valid book', async () => {
        const { getBookWithQuestions } = await import('@/lib/repositories/bookRepository');

        const mockBook = {
            id: 'b1',
            titleUk: 'Книга 1',
            titleEn: 'Book 1',
            descriptionUk: null,
            descriptionEn: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            isLearning: false,
            userLevelScores: [],
            questions: []
        } as const;

        (getBookWithQuestions as jest.Mock).mockResolvedValue(mockBook);

        const params = Promise.resolve({ id: 'b1' });
        const element = await BookPage({ params });

        render(element);

        expect(screen.getByTestId('book-page-client')).toBeInTheDocument();
        expect(screen.getByText('Книга 1')).toBeInTheDocument();
    });

    it('calls notFound when book does not exist', async () => {
        const { getBookWithQuestions } = await import('@/lib/repositories/bookRepository');
        const { notFound } = await import('next/navigation');

        (getBookWithQuestions as jest.Mock).mockResolvedValue(null);

        const params = Promise.resolve({ id: 'invalid' });
        await BookPage({ params });

        expect(notFound).toHaveBeenCalled();
    });
});
