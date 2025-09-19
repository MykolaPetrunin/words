import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { appPaths } from '@/lib/appPaths';
import { verifySessionCookie } from '@/lib/firebase/firebaseAdmin';

import { getServerSession, requireAuth, SessionUser } from '../serverAuth';

jest.mock('next/headers', () => ({
    cookies: jest.fn()
}));

jest.mock('next/navigation', () => ({
    redirect: jest.fn()
}));

jest.mock('@/lib/firebase/firebaseAdmin', () => ({
    verifySessionCookie: jest.fn()
}));

describe('serverAuth', () => {
    const mockCookieStore = {
        get: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    });

    describe('getServerSession', () => {
        it('should return null when no session cookie exists', async () => {
            mockCookieStore.get.mockReturnValue(undefined);

            const result = await getServerSession();

            expect(result).toBeNull();
            expect(mockCookieStore.get).toHaveBeenCalledWith('session');
        });

        it('should return user data when valid session exists', async () => {
            const mockSessionValue = 'valid-session-token';
            const mockDecodedClaims = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true
            };

            mockCookieStore.get.mockReturnValue({ value: mockSessionValue });
            (verifySessionCookie as jest.Mock).mockResolvedValue(mockDecodedClaims);

            const result = await getServerSession();

            expect(result).toEqual({
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true
            });
            expect(verifySessionCookie).toHaveBeenCalledWith(mockSessionValue);
        });

        it('should handle partial user data correctly', async () => {
            const mockSessionValue = 'valid-session-token';
            const mockDecodedClaims = {
                uid: 'test-uid'
            };

            mockCookieStore.get.mockReturnValue({ value: mockSessionValue });
            (verifySessionCookie as jest.Mock).mockResolvedValue(mockDecodedClaims);

            const result = await getServerSession();

            expect(result).toEqual({
                uid: 'test-uid',
                email: undefined,
                emailVerified: undefined
            });
        });

        it('should return null when session verification fails', async () => {
            const mockSessionValue = 'invalid-session-token';
            const mockError = new Error('Invalid token');

            mockCookieStore.get.mockReturnValue({ value: mockSessionValue });
            (verifySessionCookie as jest.Mock).mockRejectedValue(mockError);

            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await getServerSession();

            expect(result).toBeNull();
            expect(consoleError).toHaveBeenCalledWith('Invalid session:', mockError);

            consoleError.mockRestore();
        });

        it('should handle verification errors gracefully', async () => {
            const mockSessionValue = 'malformed-token';
            const mockError = new Error('Token verification failed');

            mockCookieStore.get.mockReturnValue({ value: mockSessionValue });
            (verifySessionCookie as jest.Mock).mockRejectedValue(mockError);

            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await getServerSession();

            expect(result).toBeNull();
            expect(verifySessionCookie).toHaveBeenCalledWith(mockSessionValue);
            expect(consoleError).toHaveBeenCalledWith('Invalid session:', mockError);

            consoleError.mockRestore();
        });
    });

    describe('requireAuth', () => {
        it('should return user when authenticated', async () => {
            const mockUser: SessionUser = {
                uid: 'test-uid',
                email: 'test@example.com',
                emailVerified: true
            };

            mockCookieStore.get.mockReturnValue({ value: 'valid-session' });
            (verifySessionCookie as jest.Mock).mockResolvedValue(mockUser);

            const result = await requireAuth();

            expect(result).toEqual(mockUser);
            expect(redirect).not.toHaveBeenCalled();
        });

        it('should redirect to login when not authenticated', async () => {
            mockCookieStore.get.mockReturnValue(undefined);

            await requireAuth();

            expect(redirect).toHaveBeenCalledWith(appPaths.login);
        });

        it('should redirect to login when session is invalid', async () => {
            mockCookieStore.get.mockReturnValue({ value: 'invalid-session' });
            (verifySessionCookie as jest.Mock).mockRejectedValue(new Error('Invalid session'));

            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            await requireAuth();

            expect(redirect).toHaveBeenCalledWith(appPaths.login);

            consoleError.mockRestore();
        });
    });
});
