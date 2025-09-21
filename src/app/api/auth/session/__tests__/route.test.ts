import { createSessionCookie, getUserProfile, verifyIdToken } from '@/lib/firebase/firebaseAdmin';
import { getUserByFirebaseId, upsertUserByFirebaseId } from '@/lib/repositories/userRepository';

import { POST } from '../route';

jest.mock('@/lib/firebase/firebaseAdmin', () => ({
    createSessionCookie: jest.fn(),
    verifyIdToken: jest.fn(),
    getUserProfile: jest.fn()
}));

jest.mock('@/lib/repositories/userRepository', () => ({
    upsertUserByFirebaseId: jest.fn(),
    getUserByFirebaseId: jest.fn()
}));

const createMockNextResponse = (data: unknown, init?: { status?: number }) => {
    const json = async () => data;
    const status = init?.status || 200;
    const cookies = { set: jest.fn() };
    return { json, status, cookies } as unknown as Response & { cookies: { set: jest.Mock } };
};

jest.mock('next/server', () => ({
    NextRequest: jest.fn((request) => ({
        json: jest.fn(() => request.json()),
        ...request
    })),
    NextResponse: {
        json: jest.fn((data: unknown, init?: { status?: number }) => createMockNextResponse(data, init))
    }
}));

describe('POST /api/auth/session', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create session cookie successfully', async () => {
        const mockIdToken = 'valid-id-token';
        const mockSessionCookie = 'session-cookie-value';
        (createSessionCookie as jest.Mock).mockResolvedValue(mockSessionCookie);
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid1', email: 'a@b.com' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: 'John Doe', email: 'a@b.com' });

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: mockIdToken })
        } as unknown as Parameters<typeof POST>[0];

        (getUserByFirebaseId as jest.Mock).mockResolvedValue(null);

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(createSessionCookie).toHaveBeenCalledWith(mockIdToken, 60 * 60 * 24 * 14 * 1000);
        expect((response as unknown as { cookies: { set: jest.Mock } }).cookies.set).toHaveBeenCalledWith('session', mockSessionCookie, {
            maxAge: 60 * 60 * 24 * 14 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        expect(data).toEqual({ success: true });
        expect((response as unknown as { status: number }).status).toBe(200);
    });

    it('should return error when idToken is missing', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({})
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(createSessionCookie).not.toHaveBeenCalled();
        expect((response as unknown as { cookies: { set: jest.Mock } }).cookies.set).not.toHaveBeenCalled();
        expect(data).toEqual({ error: 'Missing ID token' });
        expect((response as unknown as { status: number }).status).toBe(400);
    });

    it('should handle invalid JSON in request body', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(data).toEqual({ error: 'Failed to create session' });
        expect((response as unknown as { status: number }).status).toBe(500);
    });

    it('should handle createSessionCookie errors', async () => {
        const mockIdToken = 'valid-id-token';
        const mockError = new Error('Firebase error');
        (createSessionCookie as jest.Mock).mockRejectedValue(mockError);

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: mockIdToken })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        // Logger call is now internal, test only the response
        expect(data).toEqual({ error: 'Failed to create session' });
        expect(response.status).toBe(500);

        consoleError.mockRestore();
    });

    it('should set secure cookie in production', async () => {
        const prevNodeEnv = process.env.NODE_ENV;
        Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
        const mockIdToken = 'valid-id-token';
        const mockSessionCookie = 'session-cookie-value';
        (createSessionCookie as jest.Mock).mockResolvedValue(mockSessionCookie);
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid1', email: 'a@b.com' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: 'John Doe', email: 'a@b.com' });

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: mockIdToken })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);

        expect((response as unknown as { cookies: { set: jest.Mock } }).cookies.set).toHaveBeenCalledWith('session', mockSessionCookie, {
            maxAge: 60 * 60 * 24 * 14 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/'
        });
        Object.defineProperty(process.env, 'NODE_ENV', { value: prevNodeEnv, configurable: true });
    });

    it('should set locale cookie when dbUser exists', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid5', email: 'l@m.com' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: 'Ling', email: 'l@m.com' });
        (createSessionCookie as jest.Mock).mockResolvedValue('cookie');
        (getUserByFirebaseId as jest.Mock).mockResolvedValue({ locale: 'uk' });

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const cookiesSet = (response as unknown as { cookies: { set: jest.Mock } }).cookies.set;

        expect(cookiesSet).toHaveBeenCalledWith(
            'locale',
            'uk',
            expect.objectContaining({
                httpOnly: false,
                sameSite: 'lax'
            })
        );
    });

    it('should handle empty idToken', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: '' })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(data).toEqual({ error: 'Missing ID token' });
        expect((response as unknown as { status: number }).status).toBe(400);
    });

    it('should handle null idToken', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: null })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(data).toEqual({ error: 'Missing ID token' });
        expect((response as unknown as { status: number }).status).toBe(400);
    });

    it('should return 401 when decoded token has no uid', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({});
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(data).toEqual({ error: 'Invalid token' });
        expect((response as unknown as { status: number }).status).toBe(401);
    });

    it('should return 400 when email missing in token and profile', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid1' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: 'John Doe', email: null });
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await (response as unknown as { json: () => Promise<unknown> }).json();

        expect(data).toEqual({ error: 'Email not found in token' });
        expect((response as unknown as { status: number }).status).toBe(400);
    });

    it('should parse single-word displayName into firstName only', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid1', email: 'a@b.com' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: 'Cher', email: 'a@b.com' });
        (createSessionCookie as jest.Mock).mockResolvedValue('cookie');

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        await POST(mockRequest);

        expect(upsertUserByFirebaseId).toHaveBeenCalledWith({
            firebaseId: 'uid1',
            email: 'a@b.com',
            firstName: 'Cher',
            lastName: ''
        });
    });

    it('should parse multi-word displayName into firstName and lastName', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid2', email: 'b@c.com' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: '  John   Ronald   Reuel   Tolkien  ', email: 'b@c.com' });
        (createSessionCookie as jest.Mock).mockResolvedValue('cookie');

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        await POST(mockRequest);

        expect(upsertUserByFirebaseId).toHaveBeenCalledWith({
            firebaseId: 'uid2',
            email: 'b@c.com',
            firstName: 'John',
            lastName: 'Ronald Reuel Tolkien'
        });
    });

    it('should use email from profile when token email missing', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid3' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: 'Jane Doe', email: 'profile@example.com' });
        (createSessionCookie as jest.Mock).mockResolvedValue('cookie');

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        await POST(mockRequest);

        expect(upsertUserByFirebaseId).toHaveBeenCalledWith({
            firebaseId: 'uid3',
            email: 'profile@example.com',
            firstName: 'Jane',
            lastName: 'Doe'
        });
    });

    it('should handle missing displayName and set empty names', async () => {
        (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'uid4', email: 'x@y.com' });
        (getUserProfile as jest.Mock).mockResolvedValue({ displayName: null, email: 'x@y.com' });
        (createSessionCookie as jest.Mock).mockResolvedValue('cookie');

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: 'token' })
        } as unknown as Parameters<typeof POST>[0];

        await POST(mockRequest);

        expect(upsertUserByFirebaseId).toHaveBeenCalledWith({
            firebaseId: 'uid4',
            email: 'x@y.com',
            firstName: '',
            lastName: ''
        });
    });
});
