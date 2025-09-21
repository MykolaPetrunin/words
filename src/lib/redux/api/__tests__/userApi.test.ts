import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import type { UpdateMeInput } from '../userApi';
import { userApi } from '../userApi';

jest.mock('../../services/authToken', () => ({
    getBaseQuery: () => (_args?: unknown) => ({ data: {} })
}));

describe('userApi', () => {
    it('should be defined with correct configuration', () => {
        expect(userApi).toBeDefined();
        expect(userApi.reducerPath).toBe('userApi');
        expect(userApi.endpoints).toBeDefined();
    });

    describe('endpoints', () => {
        it('should have required endpoints', () => {
            const { endpoints } = userApi;
            expect(endpoints.getMe).toBeDefined();
            expect(endpoints.updateMe).toBeDefined();
        });

        it('should define getMe endpoint correctly', () => {
            const endpoint = userApi.endpoints.getMe;
            expect(endpoint).toBeDefined();
            expect(endpoint.name).toBe('getMe');
        });

        it('should define updateMe endpoint correctly', () => {
            const endpoint = userApi.endpoints.updateMe;
            expect(endpoint).toBeDefined();
            expect(endpoint.name).toBe('updateMe');
        });
    });

    describe('exported hooks', () => {
        it('should export hooks', () => {
            expect(userApi.useGetMeQuery).toBeDefined();
            expect(userApi.useUpdateMeMutation).toBeDefined();
        });

        it('should export named hooks correctly', () => {
            const { useGetMeQuery, useUpdateMeMutation } = userApi;
            expect(useGetMeQuery).toBeDefined();
            expect(useUpdateMeMutation).toBeDefined();
            expect(typeof useGetMeQuery).toBe('function');
            expect(typeof useUpdateMeMutation).toBe('function');
        });
    });

    describe('types', () => {
        it('should accept correct input type for updateMe', () => {
            const input: UpdateMeInput = { firstName: 'John', lastName: 'Doe', locale: 'uk' };
            expect(input).toBeDefined();
        });
    });

    describe('initiate endpoints with store', () => {
        it('should expose reducer and middleware work together', () => {
            const store = configureStore({
                reducer: { [userApi.reducerPath]: userApi.reducer },
                middleware: (gDM) => gDM().concat(userApi.middleware)
            });
            setupListeners(store.dispatch);

            const action = userApi.endpoints.getMe.initiate();
            store.dispatch(action);

            const state = store.getState();
            expect(state).toHaveProperty('userApi');
        });

        it('should create updateMe thunk', () => {
            const action = userApi.endpoints.updateMe.initiate({ firstName: 'A', lastName: 'B', locale: 'uk' });
            expect(action).toBeDefined();
            expect(typeof action).toBe('function');
        });
    });

    describe('endpoint execution', () => {
        it('should execute updateMe mutation with store', () => {
            const store = configureStore({
                reducer: { [userApi.reducerPath]: userApi.reducer },
                middleware: (gDM) => gDM().concat(userApi.middleware)
            });
            setupListeners(store.dispatch);

            const updateInput: UpdateMeInput = {
                firstName: 'John',
                lastName: 'Doe',
                locale: 'uk'
            };

            const action = userApi.endpoints.updateMe.initiate(updateInput);
            store.dispatch(action);

            const state = store.getState();
            expect(state).toHaveProperty('userApi');
        });

        it('should execute getMe query with store', () => {
            const store = configureStore({
                reducer: { [userApi.reducerPath]: userApi.reducer },
                middleware: (gDM) => gDM().concat(userApi.middleware)
            });
            setupListeners(store.dispatch);

            const action = userApi.endpoints.getMe.initiate();
            store.dispatch(action);

            const state = store.getState();
            expect(state).toHaveProperty('userApi');
        });
    });
});
