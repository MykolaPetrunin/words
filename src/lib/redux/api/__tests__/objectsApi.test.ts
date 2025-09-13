import type { CreateObjectInput, UpdateObjectInput } from '../objectsApi';
import { objectsApi } from '../objectsApi';

jest.mock('../../services/authToken', () => ({
    getBaseQuery: () => jest.fn()
}));

describe('objectsApi', () => {
    it('should be defined with correct configuration', () => {
        expect(objectsApi).toBeDefined();
        expect(objectsApi.reducerPath).toBe('objectsApi');
        expect(objectsApi.endpoints).toBeDefined();
    });

    describe('endpoints', () => {
        it('should have all required endpoints', () => {
            const endpoints = objectsApi.endpoints;
            expect(endpoints.getObjects).toBeDefined();
            expect(endpoints.createObject).toBeDefined();
            expect(endpoints.updateObject).toBeDefined();
            expect(endpoints.deleteObject).toBeDefined();
        });

        it('should define getObjects endpoint correctly', () => {
            const endpoint = objectsApi.endpoints.getObjects;
            expect(endpoint).toBeDefined();
            expect(endpoint.name).toBe('getObjects');
        });

        it('should define createObject endpoint correctly', () => {
            const endpoint = objectsApi.endpoints.createObject;
            expect(endpoint).toBeDefined();
            expect(endpoint.name).toBe('createObject');
        });

        it('should define updateObject endpoint correctly', () => {
            const endpoint = objectsApi.endpoints.updateObject;
            expect(endpoint).toBeDefined();
            expect(endpoint.name).toBe('updateObject');
        });

        it('should define deleteObject endpoint correctly', () => {
            const endpoint = objectsApi.endpoints.deleteObject;
            expect(endpoint).toBeDefined();
            expect(endpoint.name).toBe('deleteObject');
        });
    });

    describe('exported hooks', () => {
        it('should export all required hooks', () => {
            expect(objectsApi.useGetObjectsQuery).toBeDefined();
            expect(objectsApi.useCreateObjectMutation).toBeDefined();
            expect(objectsApi.useUpdateObjectMutation).toBeDefined();
            expect(objectsApi.useDeleteObjectMutation).toBeDefined();
        });

        it('should have correct hook types', () => {
            expect(typeof objectsApi.useGetObjectsQuery).toBe('function');
            expect(typeof objectsApi.useCreateObjectMutation).toBe('function');
            expect(typeof objectsApi.useUpdateObjectMutation).toBe('function');
            expect(typeof objectsApi.useDeleteObjectMutation).toBe('function');
        });
    });

    describe('types', () => {
        it('should accept correct input types', () => {
            const createInput: CreateObjectInput = {
                name: 'Test Object',
                data: { key: 'value' }
            };

            const updateInput: UpdateObjectInput = {
                id: 'test-id',
                body: { name: 'Updated Name' }
            };

            expect(createInput).toBeDefined();
            expect(updateInput).toBeDefined();
        });
    });
});
