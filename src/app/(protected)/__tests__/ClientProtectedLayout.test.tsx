import { render, screen } from '@testing-library/react';
import React from 'react';

import type { RootState } from '@/lib/redux/store';
import type { ApiUser } from '@/lib/types/user';

import ClientProtectedLayout from '../ClientProtectedLayout';

// Mock components
jest.mock('@/components/appSidebar/AppSidebar', () => ({
    AppSidebar: () => <div data-testid="app-sidebar">Sidebar</div>
}));

jest.mock('@/components/ui/sidebar', () => ({
    SidebarProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
    SidebarInset: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-inset">{children}</div>,
    SidebarTrigger: ({ className }: { className: string }) => (
        <button data-testid="sidebar-trigger" className={className}>
            Trigger
        </button>
    )
}));

jest.mock('@/components/ui/skeleton', () => ({
    Skeleton: ({ className }: { className: string }) => (
        <div data-testid="skeleton" className={className}>
            Loading...
        </div>
    )
}));

jest.mock('@/lib/auth/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('@/lib/redux/ReduxProvider', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock('@/lib/redux/slices/currentUserSlice', () => ({
    setUser: jest.fn()
}));

describe('ClientProtectedLayout', () => {
    const mockDispatch = jest.fn();
    const mockSetUser = jest.requireMock('@/lib/redux/slices/currentUserSlice').setUser;

    const mockInitialUser = {
        id: 'user-1',
        firebaseId: 'firebase-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        questionsPerSession: 10,
        locale: 'uk' as const,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.requireMock('@/lib/redux/ReduxProvider').useAppDispatch.mockReturnValue(mockDispatch);
        mockSetUser.mockReturnValue({ type: 'SET_USER', payload: null });
    });

    it('renders children with sidebar components', () => {
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) => {
            return selector({ currentUser: { user: null, loading: false } } as RootState);
        });
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={null}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
        expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    });

    it('shows skeleton when loading', () => {
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: null, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: true });

        render(
            <ClientProtectedLayout initialUser={null}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
        expect(screen.queryByTestId('sidebar-trigger')).not.toBeInTheDocument();
    });

    it('dispatches setUser when initialUser is provided and no currentUser', () => {
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: null, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={mockInitialUser}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(mockDispatch).toHaveBeenCalledWith(mockSetUser(mockInitialUser));
    });

    it('dispatches setUser when initialUser is provided and currentUser has different id', () => {
        const currentUser = { ...mockInitialUser, id: 'different-id' };
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: currentUser, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={mockInitialUser}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(mockDispatch).toHaveBeenCalledWith(mockSetUser(mockInitialUser));
    });

    it('dispatches setUser when initialUser is provided and currentUser has different updatedAt', () => {
        const currentUser = { ...mockInitialUser, updatedAt: '2023-01-02' };
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: currentUser, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={mockInitialUser}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(mockDispatch).toHaveBeenCalledWith(mockSetUser(mockInitialUser));
    });

    it('does not dispatch setUser when initialUser matches currentUser', () => {
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: mockInitialUser, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={mockInitialUser}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('dispatches setUser(null) when no initialUser but has currentUser', () => {
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: mockInitialUser, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={null}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(mockDispatch).toHaveBeenCalledWith(mockSetUser(null));
    });

    it('does not dispatch when no initialUser and no currentUser', () => {
        jest.requireMock('@/lib/redux/ReduxProvider').useAppSelector.mockImplementation((selector: (state: RootState) => ApiUser | null) =>
            selector({ currentUser: { user: null, loading: false } } as RootState)
        );
        jest.requireMock('@/lib/auth/AuthContext').useAuth.mockReturnValue({ loading: false });

        render(
            <ClientProtectedLayout initialUser={null}>
                <div>Test Content</div>
            </ClientProtectedLayout>
        );

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
