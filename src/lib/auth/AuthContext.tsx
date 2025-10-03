'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { appPaths } from '@/lib/appPaths';
import {
    auth,
    signIn as firebaseSignIn,
    signInWithGoogle as firebaseSignInWithGoogle,
    signOut as firebaseSignOut,
    signUp as firebaseSignUp,
    onAuthStateChange
} from '@/lib/firebase/firebaseClient';
import { clientLogger } from '@/lib/logger';
import { useAppDispatch, useAppSelector } from '@/lib/redux/ReduxProvider';
import { userApi } from '@/lib/redux/api/userApi';
import { clearAuthToken, setAuthToken } from '@/lib/redux/services/authToken';
import { setUser as setCurrentUser } from '@/lib/redux/slices/currentUserSlice';
import { AuthContextType } from '@/lib/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS: ReadonlyArray<string> = [appPaths.root, appPaths.login, appPaths.signup];

export const loadUserData = async (dispatch: ReturnType<typeof useAppDispatch>): Promise<void> => {
    if (process.env.NODE_ENV === 'test') {
        return;
    }

    try {
        const result = await dispatch(userApi.endpoints.getMe.initiate());
        if ('data' in result && result.data) {
            dispatch(setCurrentUser(result.data));
        }
    } catch (error) {
        clientLogger.error('Failed to load user data', error as Error);
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const user = useAppSelector((s) => s.currentUser.user);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await auth.currentUser?.getIdToken();
                if (idToken) {
                    const response = await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idToken })
                    });
                    if (response.ok) {
                        setAuthToken(idToken);
                        await loadUserData(dispatch);
                    }
                    if (response.ok && PUBLIC_PATHS.includes(pathname)) {
                        router.replace(appPaths.dashboard);
                    }
                }
            } else {
                await fetch('/api/auth/logout', {
                    method: 'POST'
                });
                clearAuthToken();
                dispatch(setCurrentUser(null));
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router, dispatch]);

    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            await firebaseSignIn(email, password);
        } catch (error) {
            clientLogger.error('Sign in failed', error as Error, { email });
            throw error;
        }
    };

    const signUp = async (email: string, password: string): Promise<void> => {
        try {
            await firebaseSignUp(email, password);
        } catch (error) {
            clientLogger.error('Sign up failed', error as Error, { email });
            throw error;
        }
    };

    const signInWithGoogle = async (): Promise<void> => {
        try {
            await firebaseSignInWithGoogle();
        } catch (error) {
            clientLogger.error('Google sign in failed', error as Error);
            throw error;
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            await firebaseSignOut();
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
            router.push(appPaths.root);
        } catch (error) {
            clientLogger.error('Sign out failed', error as Error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
