import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { ApiObject } from '@/lib/types/objects';

import type { CreateObjectInput, UpdateObjectInput } from '../objectsApi';
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
} from '../objectsApiHelpers';

// Removed console.error mock as we now use typed logger

describe('objectsApiHelpers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('constants', () => {
        it('should export correct constants', () => {
            expect(OBJECTS_TAG).toBe('Objects');
            expect(LIST_ID).toBe('LIST');
        });
    });

    describe('getObjectsQuery', () => {
        it('should return correct query configuration', () => {
            const result = getObjectsQuery();
            expect(result).toEqual({
                url: '/objects',
                cache: 'no-store'
            });
        });
    });

    describe('transformErrorResponse', () => {
        it('should transform error and log it', () => {
            const error: FetchBaseQueryError = { status: 500 };
            const result = transformErrorResponse(error);

            // Logger call is now internal, test only the return value
            expect(result).toEqual({
                error: 'Сталася помилка',
                status: 500
            });
        });

        it('should handle string status', () => {
            const error: FetchBaseQueryError = { status: 'PARSING_ERROR' };
            const result = transformErrorResponse(error);

            expect(result).toEqual({
                error: 'Сталася помилка',
                status: 'PARSING_ERROR'
            });
        });
    });

    describe('providesTags', () => {
        it('should provide tags for array of objects', () => {
            const objects: ApiObject[] = [
                { id: '1', name: 'Object 1', data: {} },
                { id: '2', name: 'Object 2', data: {} }
            ];

            const result = providesTags(objects);
            expect(result).toEqual([
                { type: 'Objects', id: '1' },
                { type: 'Objects', id: '2' },
                { type: 'Objects', id: 'LIST' }
            ]);
        });

        it('should provide tags for empty array', () => {
            const result = providesTags([]);
            expect(result).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });

        it('should provide tags for null', () => {
            const result = providesTags(null);
            expect(result).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });

        it('should provide tags for undefined', () => {
            const result = providesTags(undefined);
            expect(result).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });
    });

    describe('createObjectQuery', () => {
        it('should return correct mutation configuration', () => {
            const input: CreateObjectInput = {
                name: 'New Object',
                data: { key: 'value' }
            };

            const result = createObjectQuery(input);
            expect(result).toEqual({
                url: '/objects',
                method: 'POST',
                body: input
            });
        });
    });

    describe('updateObjectQuery', () => {
        it('should return correct mutation configuration', () => {
            const input: UpdateObjectInput = {
                id: '123',
                body: { name: 'Updated Name', data: { key: 'new value' } }
            };

            const result = updateObjectQuery(input);
            expect(result).toEqual({
                url: '/objects/123',
                method: 'PUT',
                body: { name: 'Updated Name', data: { key: 'new value' } }
            });
        });
    });

    describe('updateObjectInvalidatesTags', () => {
        it('should return correct tags to invalidate', () => {
            const arg: UpdateObjectInput = {
                id: '456',
                body: { name: 'Updated' }
            };

            const result = updateObjectInvalidatesTags(null, null, arg);
            expect(result).toEqual([{ type: 'Objects', id: '456' }]);
        });
    });

    describe('deleteObjectQuery', () => {
        it('should return correct mutation configuration', () => {
            const id = '789';
            const result = deleteObjectQuery(id);

            expect(result).toEqual({
                url: '/objects/789',
                method: 'DELETE'
            });
        });
    });

    describe('deleteObjectInvalidatesTags', () => {
        it('should return correct tags to invalidate', () => {
            const id = '999';
            const result = deleteObjectInvalidatesTags(null, null, id);

            expect(result).toEqual([
                { type: 'Objects', id: '999' },
                { type: 'Objects', id: 'LIST' }
            ]);
        });
    });
});
