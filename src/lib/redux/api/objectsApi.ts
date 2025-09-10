import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiObject } from '@/lib/types/objects';

import { getBaseQuery } from '../services/authToken';

const OBJECTS_TAG = 'Objects' as const;
const LIST_ID = 'LIST' as const;

export interface CreateObjectInput {
    name: string;
    data: ApiObject['data'];
}

export interface UpdateObjectInput {
    id: string;
    body: Partial<Pick<ApiObject, 'name' | 'data'>>;
}

export const objectsApi = createApi({
    reducerPath: 'objectsApi',
    baseQuery: getBaseQuery(),
    tagTypes: [OBJECTS_TAG],
    endpoints: (builder) => ({
        getObjects: builder.query<ApiObject[], void>({
            query: () => ({ url: '/objects', cache: 'no-store' as RequestCache }),
            transformErrorResponse: (response: FetchBaseQueryError): { error: string; status: number | string; data?: unknown } => {
                console.error('objectsApi getObjects error', response);
                return { error: 'Сталася помилка', status: response.status };
            },
            providesTags: (result) =>
                result ? [...result.map((obj) => ({ type: OBJECTS_TAG, id: obj.id })), { type: OBJECTS_TAG, id: LIST_ID }] : [{ type: OBJECTS_TAG, id: LIST_ID }]
        }),
        createObject: builder.mutation<ApiObject, CreateObjectInput>({
            query: (body) => ({ url: '/objects', method: 'POST', body }),
            invalidatesTags: [{ type: OBJECTS_TAG, id: LIST_ID }]
        }),
        updateObject: builder.mutation<ApiObject, UpdateObjectInput>({
            query: ({ id, body }) => ({ url: `/objects/${id}`, method: 'PUT', body }),
            invalidatesTags: (result, error, arg) => [{ type: OBJECTS_TAG, id: arg.id }]
        }),
        deleteObject: builder.mutation<{ id: string }, string>({
            query: (id) => ({ url: `/objects/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [
                { type: OBJECTS_TAG, id },
                { type: OBJECTS_TAG, id: LIST_ID }
            ]
        })
    })
});

export const { useGetObjectsQuery, useCreateObjectMutation, useUpdateObjectMutation, useDeleteObjectMutation } = objectsApi;
