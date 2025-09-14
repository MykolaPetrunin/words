import { render, screen } from '@testing-library/react';
import React from 'react';

import LoginPage from '../page';

jest.mock('@/components/auth/LoginForm', () => ({
    LoginForm: () => <div data-testid="login-form">LoginForm Component</div>
}));

describe('LoginPage', () => {
    it('should render login form', () => {
        render(<LoginPage />);

        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should have correct layout classes', () => {
        const { container } = render(<LoginPage />);
        const wrapper = container.firstChild as HTMLElement;

        expect(wrapper).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50', 'dark:bg-gray-900', 'px-4');
    });
});
