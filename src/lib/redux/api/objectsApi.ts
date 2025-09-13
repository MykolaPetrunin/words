import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiObject } from '@/lib/types/objects';

import { getBaseQuery } from '../services/authToken';

import {
    LIST_ID,
    OBJECTS_TAG,
    createObjectQuery,
    deleteObjectInvalidatesTags,
    deleteObjectQuery,
    getObjectsQuery,
    providesTags,
    transformErrorResponse,
    updateObjectInvalidatesTags,
    updateObjectQuery
} from './objectsApiHelpers';

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
            query: getObjectsQuery,
            transformErrorResponse,
            providesTags
        }),
        createObject: builder.mutation<ApiObject, CreateObjectInput>({
            query: createObjectQuery,
            invalidatesTags: [{ type: OBJECTS_TAG, id: LIST_ID }]
        }),
        updateObject: builder.mutation<ApiObject, UpdateObjectInput>({
            query: updateObjectQuery,
            invalidatesTags: updateObjectInvalidatesTags
        }),
        deleteObject: builder.mutation<{ id: string }, string>({
            query: deleteObjectQuery,
            invalidatesTags: deleteObjectInvalidatesTags
        })
    })
});

export const { useGetObjectsQuery, useCreateObjectMutation, useUpdateObjectMutation, useDeleteObjectMutation } = objectsApi;
