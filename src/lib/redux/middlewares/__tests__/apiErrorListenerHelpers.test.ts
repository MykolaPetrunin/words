import type { UnknownAction } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';

import { checkIsObjectsApiRejected, handleApiError } from '../apiErrorListenerHelpers';

const mockAlert = jest.fn();
global.alert = mockAlert;

jest.mock('@reduxjs/toolkit', () => ({
    ...jest.requireActual('@reduxjs/toolkit'),
    isRejectedWithValue: jest.fn()
}));

describe('apiErrorListenerHelpers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkIsObjectsApiRejected', () => {
        it('should return true for rejected objectsApi actions', () => {
            const action: UnknownAction = {
                type: 'objectsApi/getObjects/rejected',
                payload: { status: 500 }
            };
            (isRejectedWithValue as unknown as jest.Mock).mockReturnValue(true);

            const result = checkIsObjectsApiRejected(action);
            expect(result).toBe(true);
            expect(isRejectedWithValue).toHaveBeenCalledWith(action);
        });

        it('should return false for non-rejected actions', () => {
            const action: UnknownAction = {
                type: 'objectsApi/getObjects/fulfilled',
                payload: {}
            };
            (isRejectedWithValue as unknown as jest.Mock).mockReturnValue(false);

            const result = checkIsObjectsApiRejected(action);
            expect(result).toBe(false);
        });

        it('should return false for non-objectsApi actions', () => {
            const action: UnknownAction = {
                type: 'otherApi/someEndpoint/rejected',
                payload: {}
            };
            (isRejectedWithValue as unknown as jest.Mock).mockReturnValue(true);

            const result = checkIsObjectsApiRejected(action);
            expect(result).toBe(false);
        });

        it('should return false for actions without string type', () => {
            const action = {
                type: null,
                payload: {}
            } as unknown as UnknownAction;
            (isRejectedWithValue as unknown as jest.Mock).mockReturnValue(true);

            const result = checkIsObjectsApiRejected(action);
            expect(result).toBe(false);
        });

        it('should return false for pending actions', () => {
            const action: UnknownAction = {
                type: 'objectsApi/getObjects/pending',
                payload: {}
            };
            (isRejectedWithValue as unknown as jest.Mock).mockReturnValue(true);

            const result = checkIsObjectsApiRejected(action);
            expect(result).toBe(false);
        });
    });

    describe('handleApiError', () => {
        it('should handle 401 error', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 401, error: 'Unauthorized' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сесія завершена. Увійдіть знову.');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle 500 error', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 500, error: 'Internal Server Error' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сервер тимчасово недоступний. Спробуйте пізніше.');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle 503 error', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 503, error: 'Service Unavailable' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сервер тимчасово недоступний. Спробуйте пізніше.');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle generic error with string message', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 400, error: 'Bad Request' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Bad Request');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle error without message', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 400 }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сталася помилка');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle non-string error message', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 400, error: { detail: 'Error object' } }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сталася помилка');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle error without payload', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected'
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сталася помилка');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle string status', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 'PARSING_ERROR', error: 'Parse failed' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Parse failed');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle 404 error', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 404, error: 'Not Found' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Not Found');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle error with undefined payload', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: undefined
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сталася помилка');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });

        it('should handle 502 error', async () => {
            const action: UnknownAction = {
                type: 'objectsApi/someEndpoint/rejected',
                payload: { status: 502, error: 'Bad Gateway' }
            };

            await handleApiError(action);

            expect(mockAlert).toHaveBeenCalledWith('Сервер тимчасово недоступний. Спробуйте пізніше.');
            expect(mockAlert).toHaveBeenCalledTimes(1);
        });
    });
});
