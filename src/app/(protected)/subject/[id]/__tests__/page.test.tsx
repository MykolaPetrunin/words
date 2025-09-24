import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';

import { getBooksBySubjectId } from '@/lib/repositories/bookRepository';
import { getSubjectById } from '@/lib/repositories/subjectRepository';

import SubjectPage from '../page';

jest.mock('next/navigation', () => ({
    notFound: jest.fn()
}));

jest.mock('@/lib/repositories/subjectRepository', () => ({
    getSubjectById: jest.fn()
}));

jest.mock('@/lib/repositories/bookRepository', () => ({
    getBooksBySubjectId: jest.fn()
}));

jest.mock('@/components/booksGrid/BooksGrid', () => ({
    __esModule: true,
    default: ({ books, subject }: { books: unknown[]; subject: { nameUk: string } }) => (
        <div data-testid="books-grid">
            <div>{subject.nameUk}</div>
            <div>{books.length} books</div>
        </div>
    )
}));

describe('SubjectPage (Server Component)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders books for valid subject', async () => {
        const mockSubject = {
            id: 's1',
            nameUk: 'Програмування',
            nameEn: 'Programming',
            descriptionUk: null,
            descriptionEn: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockBooks = [
            { id: 'b1', titleUk: 'Book 1', titleEn: 'Book 1', descriptionUk: null, descriptionEn: null, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 'b2', titleUk: 'Book 2', titleEn: 'Book 2', descriptionUk: null, descriptionEn: null, isActive: true, createdAt: new Date(), updatedAt: new Date() }
        ];

        getSubjectById.mockResolvedValue(mockSubject);
        getBooksBySubjectId.mockResolvedValue(mockBooks);

        const params = Promise.resolve({ id: 's1' });
        const result = await SubjectPage({ params });

        render(result);

        expect(screen.getByTestId('books-grid')).toBeInTheDocument();
        expect(screen.getByText('Програмування')).toBeInTheDocument();
        expect(screen.getByText('2 books')).toBeInTheDocument();
    });

    it('calls notFound when subject does not exist', async () => {
        getSubjectById.mockResolvedValue(null);

        const params = Promise.resolve({ id: 'invalid' });

        await SubjectPage({ params });

        expect(notFound).toHaveBeenCalled();
    });
});
