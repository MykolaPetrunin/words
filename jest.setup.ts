import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock firebaseAdmin
jest.mock('./src/lib/firebase/firebaseAdmin', () => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com', emailVerified: true }),
    createSessionCookie: jest.fn().mockResolvedValue('mock-session-cookie'),
    verifySessionCookie: jest.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com', emailVerified: true }),
    getUserProfile: jest.fn().mockResolvedValue({ displayName: 'Test User', email: 'test@example.com' })
}));

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: (body: unknown, init?: ResponseInit) => {
            const response = new Response(JSON.stringify(body), init);
            return Object.assign(response, {
                json: async () => body
            });
        }
    }
}));

// Suppress console errors and warnings in tests
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log; // eslint-disable-line no-console

beforeAll(() => {
    console.error = jest.fn((...args) => {
        const toText = (value: unknown): string => {
            if (value instanceof Error) return `${value.name}: ${value.message}`;
            if (typeof value === 'string') return value;
            if (value && typeof value === 'object') {
                // Prefer message/stack when present
                const anyVal = value as { message?: unknown; stack?: unknown };
                if (typeof anyVal.message === 'string') return anyVal.message;
                if (typeof anyVal.stack === 'string') return anyVal.stack;
                try {
                    return JSON.stringify(value);
                } catch {
                    return String(value);
                }
            }
            return String(value);
        };

        const combined = args.map(toText).join(' ');

        // Suppress specific warnings/errors
        const suppressedPatterns = [
            'was not wrapped in act(',
            'An unhandled error occurred processing a request for the endpoint',
            'response.clone is not a function',
            'Firebase: Error',
            'Failed to start learning book',
            'Failed to stop learning book',
            'Database error',
            'NEXT_REDIRECT',
            'Book not found',
            'Session creation failed',
            'Session verify failed',
            'objectsApi getObjects error'
        ];

        if (suppressedPatterns.some((pattern) => combined.includes(pattern))) {
            return;
        }

        originalError.apply(console, args);
    });

    console.warn = jest.fn((...args) => {
        const combined = args
            .map((a) => {
                if (typeof a === 'string') return a;
                if (a && typeof a === 'object' && 'message' in (a as Record<string, unknown>) && typeof (a as Record<string, unknown>).message === 'string') {
                    return (a as Record<string, unknown>).message as string;
                }
                try {
                    return JSON.stringify(a);
                } catch {
                    return String(a);
                }
            })
            .join(' ');

        // Suppress specific warnings
        const suppressedPatterns = [
            'validateDOMNesting',
            'React does not recognize',
            'componentWillReceiveProps',
            'componentWillMount',
            'componentWillUpdate',
            'act(...) warning'
        ];

        if (suppressedPatterns.some((pattern) => combined.includes(pattern))) {
            return;
        }

        originalWarn.apply(console, args);
    });

    // eslint-disable-next-line no-console
    console.log = jest.fn((...args) => {
        const logMessage = args[0]?.toString() || '';

        // Suppress test output noise
        const suppressedPatterns = ['words-next-server', 'timestamp', 'environment'];

        if (suppressedPatterns.some((pattern) => logMessage.includes(pattern))) {
            return;
        }

        originalLog.apply(console, args);
    });
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
    console.log = originalLog; // eslint-disable-line no-console
});

// Mock Response.clone() for RTK Query
global.Response = class extends Response {
    clone() {
        return new Response(this.body, {
            status: this.status,
            statusText: this.statusText,
            headers: this.headers
        });
    }
};

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn()
        })
    });
}
