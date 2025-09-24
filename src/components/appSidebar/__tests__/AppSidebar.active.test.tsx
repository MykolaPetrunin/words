import { render, screen } from '@testing-library/react';
import React from 'react';

import { AppSidebar } from '@/components/appSidebar/AppSidebar';
import { appPaths } from '@/lib/appPaths';
import { useAppSelector } from '@/lib/redux/ReduxProvider';

jest.mock('next/navigation', () => ({
    usePathname: () => appPaths.subjects
}));

jest.mock('@/components/appSidebar/components/userNav/UserNav', () => ({
    UserNav: () => <div>UserNav</div>
}));

jest.mock('@/components/ui/sidebar', () => {
    return {
        Sidebar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        SidebarHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        SidebarFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
        SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
        SidebarMenuSubButton: ({ children, isActive }: { children: React.ReactNode; isActive?: boolean }) => <span data-active={isActive}>{children}</span>,
        SidebarInset: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
        SidebarTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
        SidebarRail: () => null,
        SidebarSeparator: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        SidebarMenuSub: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
        Skeleton: ({ className }: { className?: string }) => <div className={className}>Loading</div>,
        useSidebar: () => ({ isMobile: false, state: 'expanded' })
    };
});

jest.mock('@/hooks/useI18n', () => ({
    useI18n: () => (key: string) => key
}));

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'u1' }, loading: false })
}));

jest.mock('@/lib/redux/ReduxProvider', () => {
    const actual = jest.requireActual('@/lib/redux/ReduxProvider');
    return { ...actual, useAppSelector: jest.fn(() => ({ id: 'u1' })) };
});

describe('AppSidebar active state', () => {
    it('marks /subjects as active when pathname is /subjects', () => {
        render(<AppSidebar />);
        const activeEl = screen.getByText('common.subjects').closest('[data-active="true"]');
        expect(activeEl).toBeTruthy();
    });

    it('renders skeletons when redux user is missing while auth user exists', () => {
        (useAppSelector as jest.Mock).mockReturnValueOnce(null);

        render(<AppSidebar />);

        const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows SidebarTrigger in footer when not loading', () => {
        render(<AppSidebar />);
        // Our mock SidebarTrigger renders a button
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
