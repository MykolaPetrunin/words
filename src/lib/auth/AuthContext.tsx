'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { auth, signIn as firebaseSignIn, signOut as firebaseSignOut, signUp as firebaseSignUp, onAuthStateChange } from '@/lib/firebase/firebaseClient';
import { AuthContextType, User } from '@/lib/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const idToken = await auth.currentUser?.getIdToken();
                if (idToken) {
                    await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idToken })
                    });
                }
            } else {
                await fetch('/api/auth/logout', {
                    method: 'POST'
                });
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            await firebaseSignIn(email, password);
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string): Promise<void> => {
        try {
            await firebaseSignUp(email, password);
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            await firebaseSignOut();
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
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
