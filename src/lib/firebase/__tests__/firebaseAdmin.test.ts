// Mock modules before importing the module under test
const mockGetApps = jest.fn();
const mockInitializeApp = jest.fn();
const mockCert = jest.fn();
const mockGetAuth = jest.fn();

jest.mock('firebase-admin/app', () => ({
    initializeApp: mockInitializeApp,
    cert: mockCert,
    getApps: mockGetApps
}));

jest.mock('firebase-admin/auth', () => ({
    getAuth: mockGetAuth
}));

// Ensure we test the real module, not the global mock from jest.setup
jest.unmock('../firebaseAdmin');
jest.unmock('@/lib/firebase/firebaseAdmin');

describe('firebaseAdmin', () => {
    const mockApp = { name: 'test-app' };
    const mockAuth = {
        verifyIdToken: jest.fn(),
        createSessionCookie: jest.fn(),
        verifySessionCookie: jest.fn(),
        getUser: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();

        // Reset environment variables
        process.env.FIREBASE_PRIVATE_KEY = 'test-private-key\\nwith-newlines';
        process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
        process.env.FIREBASE_PROJECT_ID = 'test-project';

        // Default mocks
        mockGetApps.mockReturnValue([]);
        mockInitializeApp.mockReturnValue(mockApp);
        mockGetAuth.mockReturnValue(mockAuth);
        mockCert.mockReturnValue({ type: 'service_account' });
    });

    afterEach(() => {
        // Clean up environment variables
        delete process.env.FIREBASE_PRIVATE_KEY;
        delete process.env.FIREBASE_CLIENT_EMAIL;
        delete process.env.FIREBASE_PROJECT_ID;
    });

    describe('initialization', () => {
        it('should initialize admin SDK when no apps exist', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('test-token');

            expect(mockCert).toHaveBeenCalledWith({
                projectId: 'test-project',
                clientEmail: 'test@example.com',
                privateKey: 'test-private-key\nwith-newlines'
            });
            expect(mockInitializeApp).toHaveBeenCalledWith({
                credential: { type: 'service_account' }
            });
            expect(mockGetAuth).toHaveBeenCalledWith(mockApp);
        });

        it('should use existing app when apps already exist on first initialization', async () => {
            mockGetApps.mockReturnValue([mockApp]);
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('test-token');

            expect(mockInitializeApp).not.toHaveBeenCalled();
            expect(mockGetApps).toHaveBeenCalledTimes(2); // Once in if check, once to get the app
            expect(mockGetAuth).toHaveBeenCalledWith(mockApp);
        });

        it('should throw error when FIREBASE_PRIVATE_KEY is missing', async () => {
            delete process.env.FIREBASE_PRIVATE_KEY;
            const firebaseAdminModule = await import('../firebaseAdmin');

            await expect(firebaseAdminModule.verifyIdToken('test-token')).rejects.toThrow('Missing Firebase Admin SDK environment variables');
        });

        it('should throw error when FIREBASE_CLIENT_EMAIL is missing', async () => {
            delete process.env.FIREBASE_CLIENT_EMAIL;
            const firebaseAdminModule = await import('../firebaseAdmin');

            await expect(firebaseAdminModule.verifyIdToken('test-token')).rejects.toThrow('Missing Firebase Admin SDK environment variables');
        });

        it('should throw error when FIREBASE_PROJECT_ID is missing', async () => {
            delete process.env.FIREBASE_PROJECT_ID;
            const firebaseAdminModule = await import('../firebaseAdmin');

            await expect(firebaseAdminModule.verifyIdToken('test-token')).rejects.toThrow('Missing Firebase Admin SDK environment variables');
        });

        it('should initialize only once when createSessionCookie is called first', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.createSessionCookie.mockResolvedValue('session-cookie');

            await firebaseAdminModule.createSessionCookie('id-token', 3600000);

            expect(mockInitializeApp).toHaveBeenCalledTimes(1);
            expect(mockGetAuth).toHaveBeenCalledTimes(1);
        });

        it('should initialize only once when verifySessionCookie is called first', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifySessionCookie.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifySessionCookie('session-cookie');

            expect(mockInitializeApp).toHaveBeenCalledTimes(1);
            expect(mockGetAuth).toHaveBeenCalledTimes(1);
        });

        it('should handle empty string private key', async () => {
            process.env.FIREBASE_PRIVATE_KEY = '';
            const firebaseAdminModule = await import('../firebaseAdmin');

            await expect(firebaseAdminModule.verifyIdToken('test-token')).rejects.toThrow('Missing Firebase Admin SDK environment variables');
        });
    });

    describe('verifyIdToken', () => {
        let verifyIdToken: (token: string) => Promise<{ uid: string; email?: string; emailVerified?: boolean | null }>;

        beforeEach(async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            verifyIdToken = firebaseAdminModule.verifyIdToken;
        });

        it('should verify ID token successfully', async () => {
            const mockDecodedToken = {
                uid: 'test-uid',
                email: 'test@example.com',
                email_verified: true
            };
            mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

            const result = await verifyIdToken('valid-token');

            expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('valid-token');
            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true
            });
        });

        it('should handle token without email', async () => {
            const mockDecodedToken = {
                uid: 'test-uid'
            };
            mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

            const result = await verifyIdToken('valid-token');

            expect(result).toEqual({
                uid: 'test-uid',
                email: undefined,
                emailVerified: undefined
            });
        });

        it('should throw error for invalid token', async () => {
            const mockError = new Error('Token verification failed');
            mockAuth.verifyIdToken.mockRejectedValue(mockError);

            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(verifyIdToken('invalid-token')).rejects.toThrow('Invalid token');
            expect(consoleError).toHaveBeenCalledWith('Error verifying ID token:', mockError);

            consoleError.mockRestore();
        });

        it('should handle null email_verified', async () => {
            const mockDecodedToken = {
                uid: 'test-uid',
                email: 'test@example.com',
                email_verified: null
            };
            mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

            const result = await verifyIdToken('valid-token');

            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: null
            });
        });

        it('should handle false email_verified', async () => {
            const mockDecodedToken = {
                uid: 'test-uid',
                email: 'test@example.com',
                email_verified: false
            };
            mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

            const result = await verifyIdToken('valid-token');

            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: false
            });
        });
    });

    describe('createSessionCookie', () => {
        let createSessionCookie: (idToken: string, expiresIn: number) => Promise<string>;

        beforeEach(async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            createSessionCookie = firebaseAdminModule.createSessionCookie;
        });

        it('should create session cookie successfully', async () => {
            const mockSessionCookie = 'session-cookie-value';
            mockAuth.createSessionCookie.mockResolvedValue(mockSessionCookie);

            const result = await createSessionCookie('id-token', 3600000);

            expect(mockAuth.createSessionCookie).toHaveBeenCalledWith('id-token', { expiresIn: 3600000 });
            expect(result).toBe(mockSessionCookie);
        });

        it('should throw error when createSessionCookie fails', async () => {
            const mockError = new Error('Failed to create session');
            mockAuth.createSessionCookie.mockRejectedValue(mockError);

            await expect(createSessionCookie('id-token', 3600000)).rejects.toThrow('Failed to create session');
        });

        it('should handle different expiration times', async () => {
            const mockSessionCookie = 'session-cookie-value';
            mockAuth.createSessionCookie.mockResolvedValue(mockSessionCookie);

            const result = await createSessionCookie('id-token', 7200000);

            expect(mockAuth.createSessionCookie).toHaveBeenCalledWith('id-token', { expiresIn: 7200000 });
            expect(result).toBe(mockSessionCookie);
        });

        it('should handle zero expiration time', async () => {
            const mockSessionCookie = 'session-cookie-value';
            mockAuth.createSessionCookie.mockResolvedValue(mockSessionCookie);

            const result = await createSessionCookie('id-token', 0);

            expect(mockAuth.createSessionCookie).toHaveBeenCalledWith('id-token', { expiresIn: 0 });
            expect(result).toBe(mockSessionCookie);
        });
    });

    describe('verifySessionCookie', () => {
        let verifySessionCookie: (sessionCookie: string) => Promise<{ uid: string; email?: string; emailVerified?: boolean | null }>;

        beforeEach(async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            verifySessionCookie = firebaseAdminModule.verifySessionCookie;
        });

        it('should verify session cookie successfully', async () => {
            const mockDecodedClaims = {
                uid: 'test-uid',
                email: 'test@example.com',
                email_verified: true
            };
            mockAuth.verifySessionCookie.mockResolvedValue(mockDecodedClaims);

            const result = await verifySessionCookie('session-cookie');

            expect(mockAuth.verifySessionCookie).toHaveBeenCalledWith('session-cookie', true);
            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true
            });
        });

        it('should handle session without email', async () => {
            const mockDecodedClaims = {
                uid: 'test-uid'
            };
            mockAuth.verifySessionCookie.mockResolvedValue(mockDecodedClaims);

            const result = await verifySessionCookie('session-cookie');

            expect(result).toEqual({
                uid: 'test-uid',
                email: undefined,
                emailVerified: undefined
            });
        });

        it('should throw error for invalid session', async () => {
            const mockError = new Error('Session verification failed');
            mockAuth.verifySessionCookie.mockRejectedValue(mockError);

            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(verifySessionCookie('invalid-session')).rejects.toThrow('Invalid session');
            expect(consoleError).toHaveBeenCalledWith('Error verifying session cookie:', mockError);

            consoleError.mockRestore();
        });

        it('should handle null email_verified in session', async () => {
            const mockDecodedClaims = {
                uid: 'test-uid',
                email: 'test@example.com',
                email_verified: null
            };
            mockAuth.verifySessionCookie.mockResolvedValue(mockDecodedClaims);

            const result = await verifySessionCookie('session-cookie');

            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: null
            });
        });
    });

    describe('multiple function calls', () => {
        it('should reuse initialized admin auth for multiple calls', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');

            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });
            mockAuth.createSessionCookie.mockResolvedValue('session-cookie');
            mockAuth.verifySessionCookie.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('token1');
            await firebaseAdminModule.createSessionCookie('token2', 3600000);
            await firebaseAdminModule.verifySessionCookie('session');

            expect(mockInitializeApp).toHaveBeenCalledTimes(1);
            expect(mockGetAuth).toHaveBeenCalledTimes(1);
        });

        it('should handle mixed successful and failed calls', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');

            mockAuth.verifyIdToken.mockResolvedValueOnce({ uid: 'test-uid' }).mockRejectedValueOnce(new Error('Token error'));

            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result1 = await firebaseAdminModule.verifyIdToken('valid-token');
            expect(result1).toEqual({ uid: 'test-uid', email: undefined, emailVerified: undefined });

            await expect(firebaseAdminModule.verifyIdToken('invalid-token')).rejects.toThrow('Invalid token');

            expect(mockInitializeApp).toHaveBeenCalledTimes(1);
            consoleError.mockRestore();
        });

        it('should handle concurrent calls correctly', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');

            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });
            mockAuth.createSessionCookie.mockResolvedValue('session-cookie');

            const [result1, result2] = await Promise.all([firebaseAdminModule.verifyIdToken('token1'), firebaseAdminModule.createSessionCookie('token2', 3600000)]);

            expect(result1).toEqual({ uid: 'test-uid', email: undefined, emailVerified: undefined });
            expect(result2).toBe('session-cookie');
            expect(mockInitializeApp).toHaveBeenCalledTimes(1);
        });
    });

    describe('edge cases', () => {
        it('should correctly process private key with multiple newlines', async () => {
            process.env.FIREBASE_PRIVATE_KEY = 'test\\nkey\\nwith\\nmultiple\\nnewlines';
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('test-token');

            expect(mockCert).toHaveBeenCalledWith({
                projectId: 'test-project',
                clientEmail: 'test@example.com',
                privateKey: 'test\nkey\nwith\nmultiple\nnewlines'
            });
        });

        it('should handle private key without newlines', async () => {
            process.env.FIREBASE_PRIVATE_KEY = 'test-private-key-without-newlines';
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('test-token');

            expect(mockCert).toHaveBeenCalledWith({
                projectId: 'test-project',
                clientEmail: 'test@example.com',
                privateKey: 'test-private-key-without-newlines'
            });
        });

        it('should handle malformed private key', async () => {
            process.env.FIREBASE_PRIVATE_KEY = '\\\\n\\\\n';
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('test-token');

            expect(mockCert).toHaveBeenCalledWith({
                projectId: 'test-project',
                clientEmail: 'test@example.com',
                privateKey: '\\\n\\\n'
            });
        });

        it('should handle very long private keys', async () => {
            const longKey = 'BEGIN PRIVATE KEY\\n' + 'a'.repeat(1000) + '\\nEND PRIVATE KEY';
            process.env.FIREBASE_PRIVATE_KEY = longKey;
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-uid' });

            await firebaseAdminModule.verifyIdToken('test-token');

            expect(mockCert).toHaveBeenCalledWith({
                projectId: 'test-project',
                clientEmail: 'test@example.com',
                privateKey: 'BEGIN PRIVATE KEY\n' + 'a'.repeat(1000) + '\nEND PRIVATE KEY'
            });
        });
    });

    describe('getUserProfile', () => {
        let getUserProfile: (uid: string) => Promise<{ displayName?: string | null; email?: string | null }>;

        beforeEach(async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            getUserProfile = firebaseAdminModule.getUserProfile;
        });

        it('should return displayName and email from user record', async () => {
            mockAuth.getUser.mockResolvedValue({ displayName: 'John Doe', email: 'john@example.com' });

            const result = await getUserProfile('uid-1');

            expect(mockAuth.getUser).toHaveBeenCalledWith('uid-1');
            expect(result).toEqual({ displayName: 'John Doe', email: 'john@example.com' });
        });

        it('should handle null displayName and email', async () => {
            mockAuth.getUser.mockResolvedValue({ displayName: null, email: null });

            const result = await getUserProfile('uid-2');

            expect(result).toEqual({ displayName: null, email: null });
        });

        it('should initialize admin if not already initialized before getUserProfile', async () => {
            mockGetApps.mockReturnValueOnce([]);
            mockInitializeApp.mockReturnValueOnce(mockApp);
            mockGetAuth.mockReturnValueOnce(mockAuth);
            mockAuth.getUser.mockResolvedValue({ displayName: 'Init First', email: 'init@example.com' });

            const result = await getUserProfile('uid-3');

            expect(result).toEqual({ displayName: 'Init First', email: 'init@example.com' });
            expect(mockInitializeApp).toHaveBeenCalledTimes(1);
            expect(mockGetAuth).toHaveBeenCalledTimes(1);
        });

        it('should not reinitialize when admin already exists before getUserProfile', async () => {
            const firebaseAdminModule = await import('../firebaseAdmin');
            mockAuth.verifyIdToken.mockResolvedValue({ uid: 'preinit' });
            await firebaseAdminModule.verifyIdToken('token-pre');

            mockInitializeApp.mockClear();
            mockGetAuth.mockClear();

            mockAuth.getUser.mockResolvedValue({ displayName: 'Already Init', email: 'already@example.com' });

            const result = await getUserProfile('uid-4');

            expect(result).toEqual({ displayName: 'Already Init', email: 'already@example.com' });
            expect(mockInitializeApp).not.toHaveBeenCalled();
            expect(mockGetAuth).not.toHaveBeenCalled();
        });
    });
});
