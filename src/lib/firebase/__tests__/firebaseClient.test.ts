import { getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut, User as FirebaseUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import { auth, mapFirebaseUserToUser, onAuthStateChange, signIn, signOut, signUp } from '../firebaseClient';

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
    getApps: jest.fn(() => []),
    getApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn()
}));

describe('firebaseClient', () => {
    const mockApp = {};
    const mockAuth = {};

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
        process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'test-measurement-id';

        (getApps as jest.Mock).mockReturnValue([]);
        (initializeApp as jest.Mock).mockReturnValue(mockApp);
        (getAuth as jest.Mock).mockReturnValue(mockAuth);
    });

    describe('initialization', () => {
        // Firebase initialization is tested implicitly through other tests
    });

    describe('mapFirebaseUserToUser', () => {
        it('should return null for null user', () => {
            const result = mapFirebaseUserToUser(null);
            expect(result).toBeNull();
        });

        it('should map firebase user to user correctly', () => {
            const mockFirebaseUser: Partial<FirebaseUser> = {
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg'
            };

            const result = mapFirebaseUserToUser(mockFirebaseUser as FirebaseUser);

            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg'
            });
        });

        it('should handle firebase user with null fields', () => {
            const mockFirebaseUser: Partial<FirebaseUser> = {
                uid: 'test-uid',
                email: null,
                displayName: null,
                photoURL: null
            };

            const result = mapFirebaseUserToUser(mockFirebaseUser as FirebaseUser);

            expect(result).toEqual({
                uid: 'test-uid',
                email: null,
                displayName: null,
                photoURL: null
            });
        });
    });

    describe('signIn', () => {
        it('should call signInWithEmailAndPassword with correct parameters', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            await signIn(email, password);

            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
        });

        it('should throw error when signInWithEmailAndPassword fails', async () => {
            const error = new Error('Sign in failed');
            (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

            await expect(signIn('test@example.com', 'password')).rejects.toThrow('Sign in failed');
        });
    });

    describe('signUp', () => {
        it('should call createUserWithEmailAndPassword with correct parameters', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            await signUp(email, password);

            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
        });

        it('should throw error when createUserWithEmailAndPassword fails', async () => {
            const error = new Error('Sign up failed');
            (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

            await expect(signUp('test@example.com', 'password')).rejects.toThrow('Sign up failed');
        });
    });

    describe('signOut', () => {
        it('should call firebaseSignOut with auth', async () => {
            await signOut();

            expect(firebaseSignOut).toHaveBeenCalledWith(auth);
        });

        it('should throw error when firebaseSignOut fails', async () => {
            const error = new Error('Sign out failed');
            (firebaseSignOut as jest.Mock).mockRejectedValue(error);

            await expect(signOut()).rejects.toThrow('Sign out failed');
        });
    });

    describe('onAuthStateChange', () => {
        it('should subscribe to auth state changes and return unsubscribe function', () => {
            const mockCallback = jest.fn();
            const mockUnsubscribe = jest.fn();
            (onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe);

            const unsubscribe = onAuthStateChange(mockCallback);

            expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
            expect(unsubscribe).toBe(mockUnsubscribe);
        });

        it('should call callback with mapped user when auth state changes', () => {
            const mockCallback = jest.fn();
            const mockFirebaseUser: Partial<FirebaseUser> = {
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: null
            };

            (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
                callback(mockFirebaseUser);
                return jest.fn();
            });

            onAuthStateChange(mockCallback);

            expect(mockCallback).toHaveBeenCalledWith({
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: null
            });
        });

        it('should call callback with null when user signs out', () => {
            const mockCallback = jest.fn();

            (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
                callback(null);
                return jest.fn();
            });

            onAuthStateChange(mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null);
        });
    });
});
