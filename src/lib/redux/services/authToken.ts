import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

let authToken: string | null = null;

export function setAuthToken(token: string): void {
    authToken = token;
}

export function clearAuthToken(): void {
    authToken = null;
}

export const getBaseQuery = (): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
    fetchBaseQuery({
        baseUrl: 'https://api.restful-api.dev',
        prepareHeaders: (headers: Headers) => {
            if (authToken) headers.set('authorization', `Bearer ${authToken}`);
            return headers;
        }
    });
