import { render, screen } from '@testing-library/react';
import React from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth/AuthContext';

import DashboardPage from '../page';

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
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

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders inside SidebarProvider', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: { email: 'test@example.com' } });
        render(
            <SidebarProvider>
                <DashboardPage />
            </SidebarProvider>
        );
        expect(screen.getByText('DashboardPage')).toBeInTheDocument();
    });

    it('renders without crash with no user', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: null });
        render(
            <SidebarProvider>
                <DashboardPage />
            </SidebarProvider>
        );
        expect(screen.getByText('DashboardPage')).toBeInTheDocument();
    });
});
