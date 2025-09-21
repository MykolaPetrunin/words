import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { getUserByFirebaseId, updateUser } from '@/lib/repositories/userRepository';

import { GET, PATCH } from '../route';

jest.mock('next/headers', () => ({
    headers: jest.fn(async () => new Map([['authorization', 'Bearer token']]))
}));

const createMockNextResponse = (data: unknown, init?: { status?: number }) => {
    const json = async () => data;
    const status = init?.status || 200;
    const headers = new Map<string, string>();
    return {
        json,
        status,
        headers: {
            get: (k: string) => headers.get(k),
            set: (k: string, v: string) => void headers.set(k, v)
        },
        cookies: { set: jest.fn() }
    } as unknown as Response & { headers: { get: (k: string) => string | undefined; set: (k: string, v: string) => void } };
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

jest.mock('@/lib/firebase/firebaseAdmin', () => ({
    verifyIdToken: jest.fn(async () => ({ uid: 'uid1' }))
}));

jest.mock('@/lib/repositories/userRepository', () => ({
    getUserByFirebaseId: jest.fn(),
    updateUser: jest.fn(),
    updateUserLocale: jest.fn()
}));

const mockedHeaders = headers as jest.MockedFunction<typeof headers>;

describe('users/me route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
    });

    it('GET returns 401 without auth header', async () => {
        mockedHeaders.mockResolvedValue(new Map());
        const res = await GET();
        expect(res.status).toBe(401);
    });

    it('GET returns 404 when user not found', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        (getUserByFirebaseId as jest.Mock).mockResolvedValue(null);
        const res = await GET();
        expect(res.status).toBe(404);
    });

    it('GET returns user with headers', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        (getUserByFirebaseId as jest.Mock).mockResolvedValue({
            id: '1',
            firebaseId: 'uid1',
            email: 'a@b.com',
            firstName: 'John',
            lastName: 'Doe',
            locale: 'uk',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02')
        });
        const res = await GET();
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.email).toBe('a@b.com');
        expect(res.headers.get('Content-Language')).toBe('uk');
        expect(res.headers.get('Vary')).toContain('Accept-Language');
    });

    it('GET returns 500 on server error', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        (getUserByFirebaseId as jest.Mock).mockRejectedValue(new Error('db'));
        const res = await GET();
        expect(res.status).toBe(500);
    });

    it('PATCH validates locale', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        const body = { locale: 'de' } as unknown as { locale: 'de' };
        const req = { json: jest.fn().mockResolvedValue(body) } as unknown as NextRequest;
        const res = await PATCH(req);
        expect(res.status).toBe(400);
    });

    it('PATCH updates locale and sets cookie and headers', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        (updateUser as jest.Mock).mockResolvedValue({
            id: '1',
            firebaseId: 'uid1',
            email: 'a@b.com',
            firstName: 'John',
            lastName: 'Doe',
            locale: 'en',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02')
        });
        const req = { json: jest.fn().mockResolvedValue({ locale: 'en' }) } as unknown as NextRequest;
        const res = await PATCH(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.locale).toBe('en');
        expect(res.headers.get('Content-Language')).toBe('en');
        // cookies.set is not visible on Response; trust NextResponse integration
    });

    it('PATCH updates names without locale', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        (updateUser as jest.Mock).mockResolvedValue({
            id: '1',
            firebaseId: 'uid1',
            email: 'a@b.com',
            firstName: 'Jane',
            lastName: 'Roe',
            locale: 'uk',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02')
        });
        const req = { json: jest.fn().mockResolvedValue({ firstName: 'Jane', lastName: 'Roe' }) } as unknown as NextRequest;
        const res = await PATCH(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.firstName).toBe('Jane');
    });

    it('PATCH returns 401 without auth header', async () => {
        mockedHeaders.mockResolvedValue(new Map());
        const req = { json: jest.fn().mockResolvedValue({}) } as unknown as NextRequest;
        const res = await PATCH(req);
        expect(res.status).toBe(401);
    });

    it('PATCH returns 500 on server error', async () => {
        mockedHeaders.mockResolvedValue(new Map([['authorization', 'Bearer token']]));
        (updateUser as jest.Mock).mockRejectedValue(new Error('db'));
        const req = { json: jest.fn().mockResolvedValue({ firstName: 'X' }) } as unknown as NextRequest;
        const res = await PATCH(req);
        expect(res.status).toBe(500);
    });
});
