import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiUser, UserLocale } from '@/lib/types/user';

import { getBaseQuery } from '../services/authToken';

export interface UpdateMeInput {
    firstName?: string;
    lastName?: string;
    locale?: UserLocale;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: getBaseQuery({ baseUrl: '' }),
    tagTypes: ['CurrentUser'] as const,
    endpoints: (builder) => ({
        getMe: builder.query<ApiUser, void>({
            query: () => ({ url: '/api/users/me', cache: 'no-store' as RequestCache }),
            providesTags: ['CurrentUser']
        }),
        updateMe: builder.mutation<ApiUser, UpdateMeInput>({
            query: (body) => ({ url: '/api/users/me', method: 'PATCH', body }),
            invalidatesTags: ['CurrentUser']
        })
    })
});

export const { useGetMeQuery, useUpdateMeMutation } = userApi;
