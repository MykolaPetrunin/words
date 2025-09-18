import '@testing-library/jest-dom';
import 'whatwg-fetch';

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Sign in error:') ||
                args[0].includes('Sign up error:') ||
                args[0].includes('Sign out error:') ||
                args[0].includes('Error signing out:') ||
                args[0].includes('Google sign in error:') ||
                args[0].includes('Session creation error:') ||
                args[0].includes('objectsApi getObjects error'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    });

    jest.spyOn(console, 'warn').mockImplementation((...args) => {
        if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
            return;
        }
        originalWarn.call(console, ...args);
    });
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});

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
