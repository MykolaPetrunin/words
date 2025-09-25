import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import BookPageClient from '../BookPageClient';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn()
    }
}));

jest.mock('@/lib/redux/ReduxProvider', () => ({
    useAppSelector: jest.fn()
}));

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

global.fetch = jest.fn();

describe('BookPageClient', () => {
    const mockPush = jest.fn();
    const mockBook = {
        id: 'book-1',
        titleUk: 'Тестова книга',
        titleEn: 'Test Book',
        descriptionUk: 'Опис книги',
        descriptionEn: 'Book description',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isLearning: false,
        userLevelScores: [],
        questions: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        const { useAppSelector } = jest.requireMock('@/lib/redux/ReduxProvider');
        (useAppSelector as jest.Mock).mockReturnValue({ locale: 'uk' });
    });

    it('renders book information correctly', () => {
        render(<BookPageClient book={mockBook} />);

        expect(screen.getByText('Тестова книга')).toBeInTheDocument();
        expect(screen.getByText('books.startLearning')).toBeInTheDocument();
        expect(screen.getByText('books.startTesting')).toBeInTheDocument();
    });

    it('renders book information in English locale', () => {
        const { useAppSelector } = jest.requireMock('@/lib/redux/ReduxProvider');
        (useAppSelector as jest.Mock).mockReturnValue({ locale: 'en' });

        render(<BookPageClient book={mockBook} />);

        expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    it('handles start learning action and updates state', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ isLearning: true, userLevelScores: [] })
        });

        render(<BookPageClient book={mockBook} />);

        const startButton = screen.getByText('books.startLearning').closest('button')!;
        fireEvent.click(startButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/books/book-1/learning/start', {
                method: 'POST'
            });
            expect(toast.success).toHaveBeenCalledWith('books.startedLearning');
            expect(screen.getByText('books.stopLearning')).toBeInTheDocument();
        });
    });

    it('handles stop learning action and updates state', async () => {
        const bookWithLearning = { ...mockBook, isLearning: true };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ isLearning: false, userLevelScores: [] })
        });

        render(<BookPageClient book={bookWithLearning} />);

        const stopButton = screen.getByText('books.stopLearning').closest('button')!;
        fireEvent.click(stopButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/books/book-1/learning/stop', {
                method: 'POST'
            });
            expect(toast.success).toHaveBeenCalledWith('books.stoppedLearning');
            expect(screen.getByText('books.startLearning')).toBeInTheDocument();
        });
    });

    it('handles start testing action when learning', () => {
        const bookWithLearning = { ...mockBook, isLearning: true };

        render(<BookPageClient book={bookWithLearning} />);

        const testButton = screen.getByText('books.startTesting').closest('button')!;
        fireEvent.click(testButton);

        expect(toast.info).toHaveBeenCalledWith('books.testingComingSoon');
    });

    it('disables test button when not learning', () => {
        render(<BookPageClient book={mockBook} />);

        const testButton = screen.getByText('books.startTesting').closest('button')!;
        expect(testButton).toBeDisabled();
    });

    it('handles API error when starting learning', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Server error' })
        });

        render(<BookPageClient book={mockBook} />);

        const startButton = screen.getByText('books.startLearning').closest('button')!;
        fireEvent.click(startButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('books.errorStartLearning');
        });
    });

    it('handles 401 unauthorized when starting learning', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ error: 'Unauthorized' })
        });

        render(<BookPageClient book={mockBook} />);

        fireEvent.click(screen.getByText('books.startLearning').closest('button')!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('common.unauthorized');
            expect(screen.getByText('books.startLearning')).toBeInTheDocument();
        });
    });

    it('handles 404 book not found when starting learning', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({ error: 'Not found' })
        });

        render(<BookPageClient book={mockBook} />);

        fireEvent.click(screen.getByText('books.startLearning').closest('button')!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('books.bookNotFound');
        });
    });

    it('handles network error when starting learning', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network'));

        render(<BookPageClient book={mockBook} />);

        fireEvent.click(screen.getByText('books.startLearning').closest('button')!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('common.networkError');
        });
    });

    it('handles API error when stopping learning', async () => {
        const bookWithLearning = { ...mockBook, isLearning: true };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Server error' })
        });

        render(<BookPageClient book={bookWithLearning} />);

        const stopButton = screen.getByText('books.stopLearning').closest('button')!;
        fireEvent.click(stopButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('books.errorStopLearning');
        });
    });

    it('handles 401 unauthorized when stopping learning', async () => {
        const bookWithLearning = { ...mockBook, isLearning: true };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ error: 'Unauthorized' })
        });

        render(<BookPageClient book={bookWithLearning} />);

        fireEvent.click(screen.getByText('books.stopLearning').closest('button')!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('common.unauthorized');
        });
    });

    it('handles 404 book not found when stopping learning', async () => {
        const bookWithLearning = { ...mockBook, isLearning: true };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({ error: 'Not found' })
        });

        render(<BookPageClient book={bookWithLearning} />);

        fireEvent.click(screen.getByText('books.stopLearning').closest('button')!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('books.bookNotFound');
        });
    });

    it('handles network error when stopping learning', async () => {
        const bookWithLearning = { ...mockBook, isLearning: true };
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network'));

        render(<BookPageClient book={bookWithLearning} />);

        fireEvent.click(screen.getByText('books.stopLearning').closest('button')!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('common.networkError');
        });
    });

    it('renders empty state when no description', () => {
        const bookNoDesc = {
            ...mockBook,
            descriptionUk: null,
            descriptionEn: null
        };

        render(<BookPageClient book={bookNoDesc} />);

        // Should render page without error even with no description
        expect(screen.getByText('Тестова книга')).toBeInTheDocument();
    });
});
