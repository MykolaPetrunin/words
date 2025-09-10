import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';

import { objectsApi } from '../api/objectsApi';

export const apiErrorListener = createListenerMiddleware();

apiErrorListener.startListening({
    predicate: (action) =>
        isRejectedWithValue(action) &&
        typeof (action as { type?: unknown }).type === 'string' &&
        (action as { type: string }).type.startsWith(`${objectsApi.reducerPath}/`) &&
        (action as { type: string }).type.endsWith('/rejected'),
    effect: async (action) => {
        const payload = action.payload as { error?: string; status?: number | string } | undefined;
        const status = payload?.status;
        const message = payload?.error ?? 'Сталася помилка';
        if (status === 401) {
            alert('Сесія завершена. Увійдіть знову.');
            return;
        }
        if (typeof status === 'number' && status >= 500) {
            alert('Сервер тимчасово недоступний. Спробуйте пізніше.');
            return;
        }
        alert(typeof message === 'string' ? message : 'Сталася помилка');
    }
});
