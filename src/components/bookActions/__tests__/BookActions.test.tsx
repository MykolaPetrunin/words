import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import BookActions from '../BookActions';

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

describe('BookActions', () => {
    const mockOnStartLearning = jest.fn();
    const mockOnStopLearning = jest.fn();
    const mockOnStartTesting = jest.fn();

    const defaultProps = {
        isLearning: false,
        onStartLearning: mockOnStartLearning,
        onStopLearning: mockOnStopLearning,
        onStartTesting: mockOnStartTesting
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders start learning button when not learning', () => {
        render(<BookActions {...defaultProps} />);

        const learningButton = screen.getByText('books.startLearning');
        expect(learningButton).toBeInTheDocument();
        const icon = learningButton.closest('button')?.querySelector('.lucide-book-open');
        expect(icon).toBeInTheDocument();
    });

    it('renders stop learning button when learning', () => {
        render(<BookActions {...defaultProps} isLearning={true} />);

        const stopButton = screen.getByText('books.stopLearning');
        expect(stopButton).toBeInTheDocument();
        const icon = stopButton.closest('button')?.querySelector('.lucide-circle-x');
        expect(icon).toBeInTheDocument();
    });

    it('calls onStartLearning when start button is clicked', async () => {
        mockOnStartLearning.mockResolvedValue(undefined);

        render(<BookActions {...defaultProps} />);

        const button = screen.getByText('books.startLearning').closest('button')!;

        await act(async () => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(mockOnStartLearning).toHaveBeenCalled();
        });
    });

    it('calls onStopLearning when stop button is clicked', async () => {
        mockOnStopLearning.mockResolvedValue(undefined);

        render(<BookActions {...defaultProps} isLearning={true} />);

        const button = screen.getByText('books.stopLearning').closest('button')!;

        await act(async () => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(mockOnStopLearning).toHaveBeenCalled();
        });
    });

    it('shows loading state when starting learning', async () => {
        let resolvePromise: () => void;
        const promise = new Promise<void>((resolve) => {
            resolvePromise = resolve;
        });
        mockOnStartLearning.mockReturnValue(promise);

        render(<BookActions {...defaultProps} />);

        const button = screen.getByText('books.startLearning').closest('button')!;

        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.getByText('books.starting')).toBeInTheDocument();
        expect(button).toBeDisabled();

        await act(async () => {
            resolvePromise!();
            await promise;
        });
    });

    it('shows loading state when stopping learning', async () => {
        let resolvePromise: () => void;
        const promise = new Promise<void>((resolve) => {
            resolvePromise = resolve;
        });
        mockOnStopLearning.mockReturnValue(promise);

        render(<BookActions {...defaultProps} isLearning={true} />);

        const button = screen.getByText('books.stopLearning').closest('button')!;

        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.getByText('books.stopping')).toBeInTheDocument();
        expect(button).toBeDisabled();

        await act(async () => {
            resolvePromise!();
            await promise;
        });
    });

    it('renders start testing button', () => {
        render(<BookActions {...defaultProps} />);

        const testButton = screen.getByText('books.startTesting');
        expect(testButton).toBeInTheDocument();
        const icon = testButton.closest('button')?.querySelector('.lucide-play');
        expect(icon).toBeInTheDocument();
    });

    it('disables testing button when not learning', () => {
        render(<BookActions {...defaultProps} />);

        const testButton = screen.getByText('books.startTesting').closest('button')!;
        expect(testButton).toBeDisabled();
    });

    it('enables testing button when learning', () => {
        render(<BookActions {...defaultProps} isLearning={true} />);

        const testButton = screen.getByText('books.startTesting').closest('button')!;
        expect(testButton).not.toBeDisabled();
    });

    it('calls onStartTesting when test button is clicked', () => {
        render(<BookActions {...defaultProps} isLearning={true} />);

        const testButton = screen.getByText('books.startTesting').closest('button')!;
        fireEvent.click(testButton);

        expect(mockOnStartTesting).toHaveBeenCalled();
    });

    it.skip('shows tooltip when hovering over disabled test button', async () => {
        render(<BookActions {...defaultProps} />);

        const testButton = screen.getByText('books.startTesting').closest('button')!;

        await act(async () => {
            fireEvent.mouseEnter(testButton);
        });

        await waitFor(
            () => {
                expect(screen.getByText('books.needToLearnFirst')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });
});
