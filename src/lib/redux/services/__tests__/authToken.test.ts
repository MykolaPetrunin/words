import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { clearAuthToken, getBaseQuery, setAuthToken } from '../authToken';

interface MockFetchBaseQueryConfig {
    baseUrl: string;
    credentials?: RequestCredentials;
    prepareHeaders: (headers: Headers, api: BaseQueryApi) => Headers;
}

jest.mock('@reduxjs/toolkit/query', () => ({
    fetchBaseQuery: jest.fn((config: MockFetchBaseQueryConfig) => {
        const mockBaseQuery = jest.fn() as jest.Mock & { prepareHeaders: MockFetchBaseQueryConfig['prepareHeaders'] };
        mockBaseQuery.prepareHeaders = config.prepareHeaders;
        return mockBaseQuery;
    })
}));

describe('authToken service', () => {
    beforeEach(() => {
        clearAuthToken();
        jest.clearAllMocks();
    });

    describe('setAuthToken', () => {
        it('should set auth token', () => {
            const token = 'test-token-123';
            setAuthToken(token);

            const baseQuery = getBaseQuery();
            expect(baseQuery).toBeDefined();
        });
    });

    describe('clearAuthToken', () => {
        it('should clear auth token', () => {
            setAuthToken('test-token');
            clearAuthToken();

            const baseQuery = getBaseQuery();
            expect(baseQuery).toBeDefined();
        });
    });

    describe('getBaseQuery', () => {
        it('should return base query with correct baseUrl', () => {
            const baseQuery = getBaseQuery();
            expect(baseQuery).toBeDefined();
            expect(typeof baseQuery).toBe('function');

            expect(fetchBaseQuery).toHaveBeenCalledWith({
                baseUrl: 'https://api.restful-api.dev',
                credentials: 'same-origin',
                prepareHeaders: expect.any(Function)
            });
        });

        it('should respect custom baseUrl and includeCredentials', () => {
            getBaseQuery({ baseUrl: '/api', includeCredentials: true });
            const mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            const config = mockFetchBaseQuery.mock.calls[mockFetchBaseQuery.mock.calls.length - 1][0] as MockFetchBaseQueryConfig & {
                credentials: RequestCredentials;
            };
            expect(config.baseUrl).toBe('/api');
            expect(config.credentials).toBe('include');
        });

        it('should prepare headers without token when not set', () => {
            clearAuthToken();
            getBaseQuery();

            const mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            const config = mockFetchBaseQuery.mock.calls[0][0] as MockFetchBaseQueryConfig;
            const prepareHeaders = config.prepareHeaders;

            const headers = new Headers();
            const result = prepareHeaders(headers, {} as BaseQueryApi);

            expect(headers.has('authorization')).toBe(false);
            expect(result).toBe(headers);
        });

        it('should prepare headers with token when set', () => {
            const token = 'test-bearer-token';
            setAuthToken(token);
            getBaseQuery();

            const mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            const config = mockFetchBaseQuery.mock.calls[0][0] as MockFetchBaseQueryConfig;
            const prepareHeaders = config.prepareHeaders;

            const headers = new Headers();
            const result = prepareHeaders(headers, {} as BaseQueryApi);

            expect(headers.get('authorization')).toBe(`Bearer ${token}`);
            expect(result).toBe(headers);
        });

        it('should handle prepareHeaders with existing headers', () => {
            const token = 'auth-token';
            setAuthToken(token);
            getBaseQuery();

            const mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            const config = mockFetchBaseQuery.mock.calls[0][0] as MockFetchBaseQueryConfig;
            const prepareHeaders = config.prepareHeaders;

            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            headers.set('X-Custom-Header', 'custom-value');

            const result = prepareHeaders(headers, {} as BaseQueryApi);

            expect(headers.get('Content-Type')).toBe('application/json');
            expect(headers.get('X-Custom-Header')).toBe('custom-value');
            expect(headers.get('authorization')).toBe(`Bearer ${token}`);
            expect(result).toBe(headers);
        });

        it('should create consistent base query instances', () => {
            const baseQuery1 = getBaseQuery();
            const baseQuery2 = getBaseQuery();

            expect(typeof baseQuery1).toBe('function');
            expect(typeof baseQuery2).toBe('function');
        });
    });

    describe('integration scenarios', () => {
        it('should handle token lifecycle correctly', () => {
            let baseQuery = getBaseQuery();
            expect(baseQuery).toBeDefined();

            setAuthToken('integration-token');
            baseQuery = getBaseQuery();
            expect(baseQuery).toBeDefined();

            clearAuthToken();
            baseQuery = getBaseQuery();
            expect(baseQuery).toBeDefined();
        });

        it('should handle multiple token updates', () => {
            const tokens = ['token1', 'token2', 'token3'];

            tokens.forEach((token) => {
                setAuthToken(token);
                const baseQuery = getBaseQuery();
                expect(baseQuery).toBeDefined();
            });

            clearAuthToken();
            const finalQuery = getBaseQuery();
            expect(finalQuery).toBeDefined();
        });

        it('should update authorization header when token changes', () => {
            clearAuthToken();
            getBaseQuery();

            let mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            let config = mockFetchBaseQuery.mock.calls[mockFetchBaseQuery.mock.calls.length - 1][0] as MockFetchBaseQueryConfig;
            let prepareHeaders = config.prepareHeaders;
            let headers = new Headers();
            prepareHeaders(headers, {} as BaseQueryApi);
            expect(headers.has('authorization')).toBe(false);

            setAuthToken('first-token');
            getBaseQuery();

            mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            config = mockFetchBaseQuery.mock.calls[mockFetchBaseQuery.mock.calls.length - 1][0] as MockFetchBaseQueryConfig;
            prepareHeaders = config.prepareHeaders;
            headers = new Headers();
            prepareHeaders(headers, {} as BaseQueryApi);
            expect(headers.get('authorization')).toBe('Bearer first-token');

            setAuthToken('second-token');
            getBaseQuery();

            mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            config = mockFetchBaseQuery.mock.calls[mockFetchBaseQuery.mock.calls.length - 1][0] as MockFetchBaseQueryConfig;
            prepareHeaders = config.prepareHeaders;
            headers = new Headers();
            prepareHeaders(headers, {} as BaseQueryApi);
            expect(headers.get('authorization')).toBe('Bearer second-token');

            clearAuthToken();
            getBaseQuery();

            mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;
            config = mockFetchBaseQuery.mock.calls[mockFetchBaseQuery.mock.calls.length - 1][0] as MockFetchBaseQueryConfig;
            prepareHeaders = config.prepareHeaders;
            headers = new Headers();
            prepareHeaders(headers, {} as BaseQueryApi);
            expect(headers.has('authorization')).toBe(false);
        });
    });
});
