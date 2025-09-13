import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { ApiObject } from '@/lib/types/objects';

import type { CreateObjectInput, UpdateObjectInput } from './objectsApi';

export const OBJECTS_TAG = 'Objects' as const;
export const LIST_ID = 'LIST' as const;

export const getObjectsQuery = () => ({ url: '/objects', cache: 'no-store' as RequestCache });

export const transformErrorResponse = (response: FetchBaseQueryError): { error: string; status: number | string; data?: unknown } => {
    console.error('objectsApi getObjects error', response);
    return { error: 'Сталася помилка', status: response.status };
};

export const providesTags = (result: ApiObject[] | undefined | null) =>
    result ? [...result.map((obj) => ({ type: OBJECTS_TAG, id: obj.id })), { type: OBJECTS_TAG, id: LIST_ID }] : [{ type: OBJECTS_TAG, id: LIST_ID }];

export const createObjectQuery = (body: CreateObjectInput) => ({ url: '/objects', method: 'POST', body });

export const updateObjectQuery = ({ id, body }: UpdateObjectInput) => ({ url: `/objects/${id}`, method: 'PUT', body });

export const updateObjectInvalidatesTags = (result: unknown, error: unknown, arg: UpdateObjectInput) => [{ type: OBJECTS_TAG, id: arg.id }];

export const deleteObjectQuery = (id: string) => ({ url: `/objects/${id}`, method: 'DELETE' });

export const deleteObjectInvalidatesTags = (result: unknown, error: unknown, id: string) => [
    { type: OBJECTS_TAG, id },
    { type: OBJECTS_TAG, id: LIST_ID }
];
