import { cookies } from 'next/headers';

import { createSessionCookie } from '@/lib/firebase/firebaseAdmin';

import { POST } from '../route';

jest.mock('next/headers', () => ({
    cookies: jest.fn()
}));

jest.mock('@/lib/firebase/firebaseAdmin', () => ({
    createSessionCookie: jest.fn()
}));

jest.mock('next/server', () => ({
    NextRequest: jest.fn((request) => ({
        json: jest.fn(() => request.json()),
        ...request
    })),
    NextResponse: {
        json: jest.fn((data, init?) => {
            return new Response(JSON.stringify(data), {
                status: init?.status || 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        })
    }
}));

describe('POST /api/auth/session', () => {
    const mockCookieStore = {
        set: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
        process.env.NODE_ENV = 'test';
    });

    it('should create session cookie successfully', async () => {
        const mockIdToken = 'valid-id-token';
        const mockSessionCookie = 'session-cookie-value';
        (createSessionCookie as jest.Mock).mockResolvedValue(mockSessionCookie);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: mockIdToken })
        } as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(createSessionCookie).toHaveBeenCalledWith(mockIdToken, 60 * 60 * 24 * 14 * 1000);
        expect(mockCookieStore.set).toHaveBeenCalledWith('session', mockSessionCookie, {
            maxAge: 60 * 60 * 24 * 14 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });
        expect(data).toEqual({ success: true });
        expect(response.status).toBe(200);
    });

    it('should return error when idToken is missing', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({})
        } as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(createSessionCookie).not.toHaveBeenCalled();
        expect(mockCookieStore.set).not.toHaveBeenCalled();
        expect(data).toEqual({ error: 'Missing ID token' });
        expect(response.status).toBe(400);
    });

    it('should handle invalid JSON in request body', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
        } as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(data).toEqual({ error: 'Failed to create session' });
        expect(response.status).toBe(500);
    });

    it('should handle createSessionCookie errors', async () => {
        const mockIdToken = 'valid-id-token';
        const mockError = new Error('Firebase error');
        (createSessionCookie as jest.Mock).mockRejectedValue(mockError);

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: mockIdToken })
        } as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(consoleError).toHaveBeenCalledWith('Session creation error:', mockError);
        expect(data).toEqual({ error: 'Failed to create session' });
        expect(response.status).toBe(500);

        consoleError.mockRestore();
    });

    it('should set secure cookie in production', async () => {
        process.env.NODE_ENV = 'production';
        const mockIdToken = 'valid-id-token';
        const mockSessionCookie = 'session-cookie-value';
        (createSessionCookie as jest.Mock).mockResolvedValue(mockSessionCookie);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: mockIdToken })
        } as Parameters<typeof POST>[0];

        await POST(mockRequest);

        expect(mockCookieStore.set).toHaveBeenCalledWith('session', mockSessionCookie, {
            maxAge: 60 * 60 * 24 * 14 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/'
        });
    });

    it('should handle empty idToken', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: '' })
        } as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(data).toEqual({ error: 'Missing ID token' });
        expect(response.status).toBe(400);
    });

    it('should handle null idToken', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ idToken: null })
        } as Parameters<typeof POST>[0];

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(data).toEqual({ error: 'Missing ID token' });
        expect(response.status).toBe(400);
    });
});
