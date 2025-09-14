import { render, screen } from '@testing-library/react';
import React from 'react';

import SignupPage from '../page';

jest.mock('@/components/auth/SignupForm', () => ({
    SignupForm: () => <div data-testid="signup-form">SignupForm Component</div>
}));

describe('SignupPage', () => {
    it('should render signup form', () => {
        render(<SignupPage />);

        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    });

    it('should have correct layout classes', () => {
        const { container } = render(<SignupPage />);
        const wrapper = container.firstChild as HTMLElement;

        expect(wrapper).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50', 'dark:bg-gray-900', 'px-4');
    });
});
