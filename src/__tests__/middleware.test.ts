import { NextRequest, NextResponse } from 'next/server';

import { middleware } from '../middleware';

// Mock NextResponse.redirect and NextResponse.next
const createMockNextRequest = (url: string, headers?: Record<string, string>): NextRequest => {
    return {
        nextUrl: {
            pathname: new URL(url).pathname,
            clone: () => new URL(url)
        },
        cookies: {
            get: jest.fn((name: string) => {
                if (name === 'session' && headers?.cookie?.includes('session=')) {
                    return { name: 'session', value: 'test-session-value' };
                }
                return undefined;
            })
        },
        url
    } as unknown as NextRequest;
};

jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        redirect: jest.fn((url: URL) => {
            const response = new Response(null, {
                status: 307,
                headers: {
                    Location: url.toString()
                }
            });
            return response;
        }),
        next: jest.fn(() => {
            return new Response(null, { status: 200 });
        })
    }
}));

describe('middleware', () => {
    const mockUrl = 'http://localhost:3000';

    const createMockRequest = (pathname: string, hasSession: boolean = false): NextRequest => {
        const url = `${mockUrl}${pathname}`;
        const headers = hasSession ? { cookie: 'session=test-session-value' } : {};
        return createMockNextRequest(url, headers);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('public paths without session', () => {
        it('should allow access to home page', async () => {
            const nextRequest = createMockRequest('/');

            const response = await middleware(nextRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        it('should allow access to login page', async () => {
            const nextRequest = createMockRequest('/login');

            const response = await middleware(nextRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        it('should allow access to signup page', async () => {
            const nextRequest = createMockRequest('/signup');

            const response = await middleware(nextRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('protected paths without session', () => {
        it('should redirect to login from dashboard', async () => {
            const nextRequest = createMockRequest('/dashboard');

            const response = await middleware(nextRequest);

            expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockUrl));
            expect(response.status).toBe(307);
        });

        it('should redirect to login from any protected path', async () => {
            const nextRequest = createMockRequest('/profile');

            const response = await middleware(nextRequest);

            expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockUrl));
            expect(response.status).toBe(307);
        });

        it('should redirect to login from nested protected paths', async () => {
            const nextRequest = createMockRequest('/settings/account');

            const response = await middleware(nextRequest);

            expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockUrl));
            expect(response.status).toBe(307);
        });
    });

    describe('public paths with session', () => {
        it('should allow access to home page with session', async () => {
            const nextRequest = createMockRequest('/', true);

            const response = await middleware(nextRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        it('should redirect from login to dashboard with session', async () => {
            const nextRequest = createMockRequest('/login', true);

            const response = await middleware(nextRequest);

            expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/dashboard', mockUrl));
            expect(response.status).toBe(307);
        });

        it('should redirect from signup to dashboard with session', async () => {
            const nextRequest = createMockRequest('/signup', true);

            const response = await middleware(nextRequest);

            expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/dashboard', mockUrl));
            expect(response.status).toBe(307);
        });
    });

    describe('protected paths with session', () => {
        it('should allow access to dashboard with session', async () => {
            const nextRequest = createMockRequest('/dashboard', true);

            const response = await middleware(nextRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        it('should allow access to other protected paths with session', async () => {
            const nextRequest = createMockRequest('/profile', true);

            const response = await middleware(nextRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });
});
