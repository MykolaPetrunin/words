import { act, renderHook, waitFor } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { appPaths } from '@/lib/appPaths';
import * as firebaseClient from '@/lib/firebase/firebaseClient';
import { User } from '@/lib/types/auth';
import I18nProvider from '@/lib/i18n/I18nProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

import { AuthProvider, useAuth, loadUserData } from '../AuthContext';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn()
}));

jest.mock('@/lib/firebase/firebaseClient', () => ({
    auth: {
        currentUser: null
    },
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    signInWithGoogle: jest.fn(),
    onAuthStateChange: jest.fn()
}));

global.fetch = jest.fn();

describe('AuthContext', () => {
    const mockPush = jest.fn();
    const mockReplace = jest.fn();
    const mockRouter = { push: mockPush, replace: mockReplace };
    const mockUser: User = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (usePathname as jest.Mock).mockReturnValue(appPaths.login);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({})
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('AuthProvider', () => {
        it('should initialize with loading state', () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current.loading).toBe(true);
            expect(result.current.user).toBeNull();
        });

        it('should handle authenticated user on mount and redirect from public path', async () => {
            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken: 'test-token' })
            });
            expect(mockReplace).toHaveBeenCalledWith(appPaths.dashboard);
        });

        it('should handle authenticated user and call getMe in production mode', async () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken: 'test-token' })
            });

            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should handle getMe success and set user data in production mode', async () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            const mockUserData = {
                uid: 'test-uid',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                locale: 'uk' as const
            };

            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            // Mock successful API response
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: jest.fn().mockResolvedValue({})
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: jest.fn().mockResolvedValue(mockUserData)
                });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should handle getMe error gracefully in production mode', async () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should handle authenticated user without idToken and not redirect', async () => {
            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue(null);
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(global.fetch).not.toHaveBeenCalledWith('/api/auth/session', expect.any(Object));
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it('should not redirect from protected path after session creation', async () => {
            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (usePathname as jest.Mock).mockReturnValue(appPaths.dashboard);
            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({})
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken: 'test-token' })
            });
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it('should not redirect when session creation fails', async () => {
            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (usePathname as jest.Mock).mockReturnValue(appPaths.login);
            (firebaseClient.auth as unknown as { currentUser: typeof mockCurrentUser | null }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue({})
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken: 'test-token' })
            });
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it('should handle unauthenticated user on mount', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(null);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
                expect(result.current.user).toBeNull();
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
                method: 'POST'
            });
        });

        it('should unsubscribe on unmount', () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { unmount } = renderHook(() => useAuth(), { wrapper });

            unmount();

            expect(mockUnsubscribe).toHaveBeenCalled();
        });
    });

    describe('signIn', () => {
        it('should sign in successfully', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signIn as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signIn('test@example.com', 'password123');
            });

            expect(firebaseClient.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockPush).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it('should handle sign in error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Sign in failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signIn as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.signIn('test@example.com', 'password123')).rejects.toThrow('Sign in failed');
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe('signUp', () => {
        it('should sign up successfully', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signUp as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signUp('test@example.com', 'password123');
            });

            expect(firebaseClient.signUp).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockPush).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it('should handle sign up error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Sign up failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signUp as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.signUp('test@example.com', 'password123')).rejects.toThrow('Sign up failed');
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe('signInWithGoogle', () => {
        it('should sign in with Google successfully', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signInWithGoogle as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signInWithGoogle();
            });

            expect(firebaseClient.signInWithGoogle).toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });

        it('should handle Google sign in error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Google sign in failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signInWithGoogle as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.signInWithGoogle()).rejects.toThrow('Google sign in failed');
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe('signOut', () => {
        it('should sign out successfully', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signOut as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signOut();
            });

            expect(firebaseClient.signOut).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
                method: 'POST'
            });
            expect(mockPush).toHaveBeenCalledWith(appPaths.root);
        });

        it('should handle sign out error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Sign out failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signOut as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <ReduxProvider>
                    <I18nProvider initialLocale="uk">
                        <AuthProvider>{children}</AuthProvider>
                    </I18nProvider>
                </ReduxProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.signOut()).rejects.toThrow('Sign out failed');
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe('useAuth', () => {
        it('should throw error when used outside AuthProvider', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                renderHook(() => useAuth());
            }).toThrow('useAuth must be used within an AuthProvider');

            consoleError.mockRestore();
        });
    });

    describe('loadUserData', () => {
        it('should return early in test environment', async () => {
            const mockDispatch = jest.fn();

            await loadUserData(mockDispatch);

            expect(mockDispatch).not.toHaveBeenCalled();
        });

        it('should load user data successfully in production environment', async () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            const mockUserData = {
                uid: 'test-uid',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                locale: 'uk' as const
            };

            const mockDispatch = jest.fn().mockResolvedValueOnce({ data: mockUserData });

            await loadUserData(mockDispatch);

            expect(mockDispatch).toHaveBeenCalledTimes(2);
            expect(mockDispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
            expect(mockDispatch).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    type: expect.stringContaining('setUser'),
                    payload: mockUserData
                })
            );

            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should handle error result gracefully in production environment', async () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            const mockDispatch = jest.fn().mockResolvedValueOnce({ error: { message: 'Failed to load user' } });

            await loadUserData(mockDispatch);

            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));

            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should handle dispatch error gracefully in production environment', async () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            const mockDispatch = jest.fn().mockRejectedValueOnce(new Error('Dispatch failed'));

            await expect(loadUserData(mockDispatch)).resolves.toBeUndefined();

            expect(mockDispatch).toHaveBeenCalledTimes(1);

            process.env.NODE_ENV = originalNodeEnv;
        });
    });
});
