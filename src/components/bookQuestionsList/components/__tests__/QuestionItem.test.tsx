import { render, screen } from '@testing-library/react';

import QuestionItem from '@/components/bookQuestionsList/components/QuestionItem';
import type { DbBookWithQuestions } from '@/lib/repositories/bookRepository';

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

describe('QuestionItem', () => {
    const baseQuestion: DbBookWithQuestions['questions'][number] = {
        id: 'q1',
        textUk: 'Питання UA',
        textEn: 'Question EN',
        theoryUk: null,
        theoryEn: null,
        level: { id: 'l1', nameUk: 'Рівень UA', nameEn: 'Level EN' }
    };

    it('renders Ukrainian content with index and level label', () => {
        render(<QuestionItem index={0} question={baseQuestion} locale="uk" />);

        expect(screen.getByText('1.')).toBeInTheDocument();
        expect(screen.getByText('Питання UA')).toBeInTheDocument();
        expect(screen.getByText('books.level: Рівень UA')).toBeInTheDocument();
    });

    it('renders English content with index and level label', () => {
        render(<QuestionItem index={1} question={baseQuestion} locale="en" />);

        expect(screen.getByText('2.')).toBeInTheDocument();
        expect(screen.getByText('Question EN')).toBeInTheDocument();
        expect(screen.getByText('books.level: Level EN')).toBeInTheDocument();
    });

    it('shows 0% progress when userScore is undefined', () => {
        render(<QuestionItem index={0} question={baseQuestion} locale="uk" />);

        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });

    it('shows 60% progress when userScore is 3', () => {
        const questionWithScore = { ...baseQuestion, userScore: 3 };
        render(<QuestionItem index={0} question={questionWithScore} locale="uk" />);

        expect(screen.getByText('60%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
    });

    it('shows 100% progress when userScore is 5', () => {
        const questionWithScore = { ...baseQuestion, userScore: 5 };
        render(<QuestionItem index={0} question={questionWithScore} locale="uk" />);

        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('shows 100% progress when userScore is greater than 5', () => {
        const questionWithScore = { ...baseQuestion, userScore: 7 };
        render(<QuestionItem index={0} question={questionWithScore} locale="uk" />);

        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });
});
