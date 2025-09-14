import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import * as firebaseClient from '@/lib/firebase/firebaseClient';
import { User } from '@/lib/types/auth';

import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('@/lib/firebase/firebaseClient', () => ({
    auth: {
        currentUser: null
    },
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn()
}));

global.fetch = jest.fn();

describe('AuthContext', () => {
    const mockPush = jest.fn();
    const mockRouter = { push: mockPush };
    const mockUser: User = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
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

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current.loading).toBe(true);
            expect(result.current.user).toBeNull();
        });

        it('should handle authenticated user on mount', async () => {
            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue('test-token');
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (firebaseClient.auth as { currentUser: typeof mockCurrentUser }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
                expect(result.current.user).toEqual(mockUser);
            });

            expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken: 'test-token' })
            });
        });

        it('should handle authenticated user without idToken', async () => {
            const mockUnsubscribe = jest.fn();
            const mockGetIdToken = jest.fn().mockResolvedValue(null);
            const mockCurrentUser = {
                getIdToken: mockGetIdToken
            };

            (firebaseClient.auth as { currentUser: typeof mockCurrentUser }).currentUser = mockCurrentUser;
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(mockUser);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
                expect(result.current.user).toEqual(mockUser);
            });

            expect(global.fetch).not.toHaveBeenCalledWith('/api/auth/session', expect.any(Object));
        });

        it('should handle unauthenticated user on mount', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                callback(null);
                return mockUnsubscribe;
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

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

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

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

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signIn('test@example.com', 'password123');
            });

            expect(firebaseClient.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });

        it('should handle sign in error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Sign in failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signIn as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

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

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signUp('test@example.com', 'password123');
            });

            expect(firebaseClient.signUp).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });

        it('should handle sign up error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Sign up failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signUp as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.signUp('test@example.com', 'password123')).rejects.toThrow('Sign up failed');
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe('signOut', () => {
        it('should sign out successfully', async () => {
            const mockUnsubscribe = jest.fn();
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signOut as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.signOut();
            });

            expect(firebaseClient.signOut).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
                method: 'POST'
            });
            expect(mockPush).toHaveBeenCalledWith('/');
        });

        it('should handle sign out error', async () => {
            const mockUnsubscribe = jest.fn();
            const mockError = new Error('Sign out failed');
            (firebaseClient.onAuthStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);
            (firebaseClient.signOut as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

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
});
