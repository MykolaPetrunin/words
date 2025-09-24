import { render, screen } from '@testing-library/react';

import NotFound from '../not-found';

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

describe('Subject Not Found', () => {
    it('renders not found message', () => {
        render(<NotFound />);

        expect(screen.getByText('subjects.notFound')).toBeInTheDocument();
        expect(screen.getByText('subjects.backToList')).toBeInTheDocument();
    });
});
