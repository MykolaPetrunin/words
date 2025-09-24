import { render, screen } from '@testing-library/react';

import BooksGrid from '../BooksGrid';

jest.mock('@/lib/redux/ReduxProvider', () => ({
    useAppSelector: jest.fn(() => ({ id: 'u1', locale: 'uk' }))
}));

describe('BooksGrid (Client Component)', () => {
    it('renders book tiles with localized names', () => {
        const books = [
            {
                id: '1',
                titleUk: 'JavaScript',
                titleEn: 'JavaScript',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                titleUk: 'TypeScript',
                titleEn: 'TypeScript',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const subject = {
            id: 's1',
            nameUk: 'Програмування',
            nameEn: 'Programming',
            descriptionUk: null,
            descriptionEn: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        render(<BooksGrid books={books} subject={subject} />);

        expect(screen.getByText('Програмування')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
});
