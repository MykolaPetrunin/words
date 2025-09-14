import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import React from 'react';

import ProtectedLayout from '../layout';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn()
}));

jest.mock('@/components/UserMenu', () => ({
    UserMenu: () => <div data-testid="user-menu">UserMenu Component</div>
}));

jest.mock('next/link', () => {
    const MockedLink = ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
        <a href={href} className={className}>
            {children}
        </a>
    );
    MockedLink.displayName = 'MockedLink';
    return MockedLink;
});

describe('ProtectedLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render children and navigation', () => {
        (usePathname as jest.Mock).mockReturnValue('/dashboard');

        render(
            <ProtectedLayout>
                <div>Test Content</div>
            </ProtectedLayout>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByText('Words Next')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText("Об'єкти")).toBeInTheDocument();
        expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    });

    it('should highlight active dashboard link', () => {
        (usePathname as jest.Mock).mockReturnValue('/dashboard');

        render(
            <ProtectedLayout>
                <div>Test Content</div>
            </ProtectedLayout>
        );

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        expect(dashboardLink).toHaveClass('border-primary', 'text-gray-900', 'dark:text-white');

        const objectsLink = screen.getByText("Об'єкти").closest('a');
        expect(objectsLink).toHaveClass('border-transparent', 'text-gray-500');
    });

    it('should highlight active objects link', () => {
        (usePathname as jest.Mock).mockReturnValue('/objects');

        render(
            <ProtectedLayout>
                <div>Test Content</div>
            </ProtectedLayout>
        );

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        expect(dashboardLink).toHaveClass('border-transparent', 'text-gray-500');

        const objectsLink = screen.getByText("Об'єкти").closest('a');
        expect(objectsLink).toHaveClass('border-primary', 'text-gray-900', 'dark:text-white');
    });

    it('should render correct navigation structure', () => {
        (usePathname as jest.Mock).mockReturnValue('/dashboard');

        const { container } = render(
            <ProtectedLayout>
                <div>Test Content</div>
            </ProtectedLayout>
        );

        const nav = container.querySelector('nav');
        expect(nav).toHaveClass('bg-white', 'dark:bg-gray-800', 'shadow-sm');

        const main = container.querySelector('main');
        expect(main).toBeInTheDocument();
        expect(main?.textContent).toBe('Test Content');
    });

    it('should have correct links', () => {
        (usePathname as jest.Mock).mockReturnValue('/dashboard');

        render(
            <ProtectedLayout>
                <div>Test Content</div>
            </ProtectedLayout>
        );

        const logoLink = screen.getByText('Words Next').closest('a');
        expect(logoLink).toHaveAttribute('href', '/dashboard');

        const dashboardNavLink = screen.getByText('Dashboard').closest('a');
        expect(dashboardNavLink).toHaveAttribute('href', '/dashboard');

        const objectsNavLink = screen.getByText("Об'єкти").closest('a');
        expect(objectsNavLink).toHaveAttribute('href', '/objects');
    });
});
