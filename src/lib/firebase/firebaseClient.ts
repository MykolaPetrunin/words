import type { FirebaseApp } from 'firebase/app';
import { getApp, getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut, User as FirebaseUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import { User } from '@/lib/types/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export interface FirebaseAppDependencies {
    getApps: () => FirebaseApp[];
    getApp: () => FirebaseApp;
    initializeApp: (config: typeof firebaseConfig) => FirebaseApp;
    getAuth: (app: FirebaseApp) => Auth;
}

export const createFirebaseApp = (dependencies: FirebaseAppDependencies): { app: FirebaseApp; auth: Auth } => {
    const appInstance = dependencies.getApps().length === 0 ? dependencies.initializeApp(firebaseConfig) : dependencies.getApp();
    const authInstance = dependencies.getAuth(appInstance);
    return { app: appInstance, auth: authInstance };
};

const { auth } = createFirebaseApp({ getApps, getApp, initializeApp, getAuth });

export const mapFirebaseUserToUser = (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) return null;

    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
    };
};

export const signIn = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
};

export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        const user = mapFirebaseUserToUser(firebaseUser);
        callback(user);
    });

    return unsubscribe;
};

export { auth };
