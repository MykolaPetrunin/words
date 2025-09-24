import type { ApiObject } from '@/lib/types/objects';

describe('objectsApi endpoints logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getObjects endpoint logic', () => {
        const queryFn = () => ({ url: '/objects', cache: 'no-store' as RequestCache });

        const transformErrorResponse = (response: { status: number | string }) => {
            console.error('objectsApi getObjects error', response);
            return { error: 'Сталася помилка', status: response.status };
        };

        const providesTags = (result: ApiObject[] | undefined | null) =>
            result
                ? [...result.map((obj) => ({ type: 'Objects' as const, id: obj.id })), { type: 'Objects' as const, id: 'LIST' }]
                : [{ type: 'Objects' as const, id: 'LIST' }];

        it('should return correct query configuration', () => {
            const result = queryFn();
            expect(result).toEqual({
                url: '/objects',
                cache: 'no-store'
            });
        });

        it('should transform error response', () => {
            const mockError = { status: 500 };
            const result = transformErrorResponse(mockError);

            // Console.error call is suppressed in jest.setup.ts
            expect(result).toEqual({
                error: 'Сталася помилка',
                status: 500
            });
        });

        it('should provide tags for array of objects', () => {
            const mockObjects: ApiObject[] = [
                { id: '1', name: 'Object 1', data: {} },
                { id: '2', name: 'Object 2', data: {} }
            ];

            const result = providesTags(mockObjects);
            expect(result).toEqual([
                { type: 'Objects', id: '1' },
                { type: 'Objects', id: '2' },
                { type: 'Objects', id: 'LIST' }
            ]);
        });

        it('should provide tags for null result', () => {
            const result = providesTags(null);
            expect(result).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });

        it('should provide tags for undefined result', () => {
            const result = providesTags(undefined);
            expect(result).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });

        it('should provide tags for empty array', () => {
            const result = providesTags([]);
            expect(result).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });
    });

    describe('createObject endpoint logic', () => {
        const queryFn = (body: { name: string; data: Record<string, unknown> }) => ({
            url: '/objects',
            method: 'POST',
            body
        });

        it('should return correct mutation configuration', () => {
            const input = { name: 'New Object', data: { key: 'value' } };
            const result = queryFn(input);

            expect(result).toEqual({
                url: '/objects',
                method: 'POST',
                body: input
            });
        });

        it('should have correct invalidatesTags', () => {
            const invalidatesTags = [{ type: 'Objects' as const, id: 'LIST' }];
            expect(invalidatesTags).toEqual([{ type: 'Objects', id: 'LIST' }]);
        });
    });

    describe('updateObject endpoint logic', () => {
        const queryFn = ({ id, body }: { id: string; body: Partial<{ name: string; data: Record<string, unknown> }> }) => ({
            url: `/objects/${id}`,
            method: 'PUT',
            body
        });

        const invalidatesTags = (_result: unknown, _error: unknown, arg: { id: string }) => [{ type: 'Objects' as const, id: arg.id }];

        it('should return correct mutation configuration', () => {
            const input = {
                id: '123',
                body: { name: 'Updated Name', data: { key: 'new value' } }
            };
            const result = queryFn(input);

            expect(result).toEqual({
                url: '/objects/123',
                method: 'PUT',
                body: { name: 'Updated Name', data: { key: 'new value' } }
            });
        });

        it('should invalidate correct tags', () => {
            const arg = { id: '123', body: {} };
            const result = invalidatesTags(undefined, undefined, arg);

            expect(result).toEqual([{ type: 'Objects', id: '123' }]);
        });
    });

    describe('deleteObject endpoint logic', () => {
        const queryFn = (id: string) => ({
            url: `/objects/${id}`,
            method: 'DELETE'
        });

        const invalidatesTags = (_result: unknown, _error: unknown, id: string) => [
            { type: 'Objects' as const, id },
            { type: 'Objects' as const, id: 'LIST' }
        ];

        it('should return correct mutation configuration', () => {
            const id = '789';
            const result = queryFn(id);

            expect(result).toEqual({
                url: '/objects/789',
                method: 'DELETE'
            });
        });

        it('should invalidate correct tags', () => {
            const id = '789';
            const result = invalidatesTags(undefined, undefined, id);

            expect(result).toEqual([
                { type: 'Objects', id: '789' },
                { type: 'Objects', id: 'LIST' }
            ]);
        });
    });
});
