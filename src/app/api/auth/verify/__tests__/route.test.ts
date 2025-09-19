import { cookies } from 'next/headers';

import { verifySessionCookie } from '@/lib/firebase/firebaseAdmin';

import { GET } from '../route';

jest.mock('next/headers', () => ({
    cookies: jest.fn()
}));

jest.mock('@/lib/firebase/firebaseAdmin', () => ({
    verifySessionCookie: jest.fn()
}));

jest.mock('next/server', () => ({
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

describe('GET /api/auth/verify', () => {
    const mockCookieStore = {
        get: jest.fn(),
        set: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    });

    it('should return 401 when session cookie is missing', async () => {
        mockCookieStore.get.mockReturnValue(undefined);

        const response = await GET();
        const data = await response.json();

        expect(data).toEqual({ valid: false });
        expect(response.status).toBe(401);
        expect(mockCookieStore.set).not.toHaveBeenCalled();
        expect(verifySessionCookie).not.toHaveBeenCalled();
    });

    it('should return valid: true for a valid session cookie', async () => {
        mockCookieStore.get.mockReturnValue({ name: 'session', value: 'cookie-value' });
        (verifySessionCookie as jest.Mock).mockResolvedValue({ uid: 'uid', email: 'a@b.com' });

        const response = await GET();
        const data = await response.json();

        expect(verifySessionCookie).toHaveBeenCalledWith('cookie-value');
        expect(data).toEqual({ valid: true });
        expect(response.status).toBe(200);
        expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it('should clear cookie and return 401 when verification fails', async () => {
        mockCookieStore.get.mockReturnValue({ name: 'session', value: 'bad-cookie' });
        (verifySessionCookie as jest.Mock).mockRejectedValue(new Error('Invalid session'));

        const response = await GET();
        const data = await response.json();

        expect(verifySessionCookie).toHaveBeenCalledWith('bad-cookie');
        expect(mockCookieStore.set).toHaveBeenCalledWith('session', '', { maxAge: 0, path: '/' });
        expect(data).toEqual({ valid: false });
        expect(response.status).toBe(401);
    });
});
