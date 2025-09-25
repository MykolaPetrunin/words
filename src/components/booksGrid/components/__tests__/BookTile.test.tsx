import { render, screen } from '@testing-library/react';

import BookTile from '../BookTile';

describe('BookTile', () => {
    it('renders book tile with title and link', () => {
        render(<BookTile id="book-1" title="Test Book" isLearning={false} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/books/book-1');
        expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    it('shows learning icon when book is being learned', () => {
        render(<BookTile id="book-2" title="Learning Book" isLearning={true} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/books/book-2');
        expect(screen.getByText('Learning Book')).toBeInTheDocument();

        // Check for the BookOpenIcon (it has specific classes)
        const icon = document.querySelector('.lucide-book-open');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('h-5', 'w-5', 'text-green-500');
    });

    it('does not show learning icon when book is not being learned', () => {
        render(<BookTile id="book-3" title="Not Learning Book" isLearning={false} />);

        const icon = document.querySelector('.lucide-book-open');
        expect(icon).not.toBeInTheDocument();
    });
});
