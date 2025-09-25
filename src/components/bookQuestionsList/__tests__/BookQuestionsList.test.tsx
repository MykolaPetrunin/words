import { render, screen } from '@testing-library/react';

import BookQuestionsList from '@/components/bookQuestionsList/BookQuestionsList';
import type { DbBookWithQuestions } from '@/lib/repositories/bookRepository';

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

describe('BookQuestionsList', () => {
    const makeQuestion = (): DbBookWithQuestions['questions'][number] => ({
        id: 'q1',
        textUk: 'Питання UA',
        textEn: 'Question EN',
        level: { id: 'l1', nameUk: 'Рівень UA', nameEn: 'Level EN' }
    });

    it('renders heading and items', () => {
        const question = makeQuestion();
        render(<BookQuestionsList questions={[question]} locale="uk" />);

        expect(screen.getByText('books.questionsList')).toBeInTheDocument();
        expect(screen.getByText('1.')).toBeInTheDocument();
        expect(screen.getByText('Питання UA')).toBeInTheDocument();
    });

    it('renders heading and no items for empty list', () => {
        render(<BookQuestionsList questions={[]} locale="uk" />);

        expect(screen.getByText('books.questionsList')).toBeInTheDocument();
        expect(screen.queryByText('1.')).not.toBeInTheDocument();
    });
});
