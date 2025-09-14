import { render, screen } from '@testing-library/react';
import React from 'react';

import AuthLayout from '../layout';

describe('AuthLayout', () => {
    it('should render children', () => {
        const childText = 'Test Child Content';
        render(
            <AuthLayout>
                <div>{childText}</div>
            </AuthLayout>
        );

        expect(screen.getByText(childText)).toBeInTheDocument();
    });

    it('should render multiple children', () => {
        render(
            <AuthLayout>
                <div>Child 1</div>
                <div>Child 2</div>
            </AuthLayout>
        );

        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
});
