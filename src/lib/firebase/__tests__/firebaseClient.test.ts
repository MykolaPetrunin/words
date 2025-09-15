import { getApps, initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';

import {
    auth,
    createFirebaseApp,
    FirebaseAppDependencies,
    mapFirebaseUserToUser,
    onAuthStateChange,
    signIn,
    signOut,
    signUp,
    signInWithGoogle,
    handleRedirectResult
} from '../firebaseClient';

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
    onAuthStateChanged: jest.fn(),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
        setCustomParameters: jest.fn(),
        addScope: jest.fn()
    })),
    signInWithPopup: jest.fn(),
    signInWithRedirect: jest.fn(),
    getRedirectResult: jest.fn()
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

    describe('createFirebaseApp', () => {
        it('should initialize new app when no apps exist', () => {
            const mockApp = {} as unknown as import('firebase/app').FirebaseApp;
            const mockAuthInstance = {} as unknown as import('firebase/auth').Auth;

            const getAppsMock: FirebaseAppDependencies['getApps'] = jest.fn(() => [] as import('firebase/app').FirebaseApp[]);
            const getAppMock: FirebaseAppDependencies['getApp'] = jest.fn(() => mockApp);
            const initializeAppMock: FirebaseAppDependencies['initializeApp'] = jest.fn(() => mockApp);
            const getAuthMock: FirebaseAppDependencies['getAuth'] = jest.fn(() => mockAuthInstance);

            const { app: appInstance, auth: authInstance } = createFirebaseApp({
                getApps: getAppsMock,
                getApp: getAppMock,
                initializeApp: initializeAppMock,
                getAuth: getAuthMock
            });

            expect(getAppsMock).toHaveBeenCalled();
            expect(initializeAppMock).toHaveBeenCalledTimes(1);
            expect(getAppMock).not.toHaveBeenCalled();
            expect(getAuthMock).toHaveBeenCalledWith(appInstance);
            expect(appInstance).toBe(mockApp);
            expect(authInstance).toBe(mockAuthInstance);
        });

        it('should reuse existing app when apps exist', () => {
            const mockApp = {} as unknown as import('firebase/app').FirebaseApp;
            const mockAuthInstance = {} as unknown as import('firebase/auth').Auth;

            const getAppsMock: FirebaseAppDependencies['getApps'] = jest.fn(() => [mockApp] as import('firebase/app').FirebaseApp[]);
            const getAppMock: FirebaseAppDependencies['getApp'] = jest.fn(() => mockApp);
            const initializeAppMock: FirebaseAppDependencies['initializeApp'] = jest.fn(() => mockApp);
            const getAuthMock: FirebaseAppDependencies['getAuth'] = jest.fn(() => mockAuthInstance);

            const { app: appInstance, auth: authInstance } = createFirebaseApp({
                getApps: getAppsMock,
                getApp: getAppMock,
                initializeApp: initializeAppMock,
                getAuth: getAuthMock
            });

            expect(getAppsMock).toHaveBeenCalled();
            expect(getAppMock).toHaveBeenCalledTimes(1);
            expect(initializeAppMock).not.toHaveBeenCalled();
            expect(getAuthMock).toHaveBeenCalledWith(appInstance);
            expect(appInstance).toBe(mockApp);
            expect(authInstance).toBe(mockAuthInstance);
        });
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

    describe('signInWithGoogle', () => {
        it('should call signInWithPopup with google provider', async () => {
            await signInWithGoogle();

            expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.objectContaining({}));
        });

        it('should use redirect when popup is blocked', async () => {
            const popupBlockedError = new Error('Popup blocked') as Error & { code: string };
            popupBlockedError.code = 'auth/popup-blocked';
            (signInWithPopup as jest.Mock).mockRejectedValue(popupBlockedError);

            await signInWithGoogle();

            expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.objectContaining({}));
            expect(signInWithRedirect).toHaveBeenCalledWith(auth, expect.objectContaining({}));
        });

        it('should use redirect when unauthorized domain error occurs', async () => {
            const unauthorizedError = new Error('Unauthorized domain') as Error & { code: string };
            unauthorizedError.code = 'auth/unauthorized-domain';
            (signInWithPopup as jest.Mock).mockRejectedValue(unauthorizedError);

            await signInWithGoogle();

            expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.objectContaining({}));
            expect(signInWithRedirect).toHaveBeenCalledWith(auth, expect.objectContaining({}));
        });

        it('should throw error for other error codes', async () => {
            const otherError = new Error('Other error') as Error & { code: string };
            otherError.code = 'auth/other-error';
            (signInWithPopup as jest.Mock).mockRejectedValue(otherError);

            await expect(signInWithGoogle()).rejects.toThrow('Other error');
            expect(signInWithRedirect).not.toHaveBeenCalled();
        });
    });

    describe('handleRedirectResult', () => {
        it('should return mapped user when redirect result exists', async () => {
            const mockFirebaseUser: Partial<FirebaseUser> = {
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: null
            };
            const mockResult = { user: mockFirebaseUser };
            (getRedirectResult as jest.Mock).mockResolvedValue(mockResult);

            const result = await handleRedirectResult();

            expect(getRedirectResult).toHaveBeenCalledWith(auth);
            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: null
            });
        });

        it('should return null when no redirect result', async () => {
            (getRedirectResult as jest.Mock).mockResolvedValue(null);

            const result = await handleRedirectResult();

            expect(getRedirectResult).toHaveBeenCalledWith(auth);
            expect(result).toBeNull();
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
