import type { UnknownAction } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';

import { objectsApi } from '../api/objectsApi';

export const checkIsObjectsApiRejected = (action: UnknownAction): boolean => {
    return isRejectedWithValue(action) && typeof action.type === 'string' && action.type.startsWith(`${objectsApi.reducerPath}/`) && action.type.endsWith('/rejected');
};

export const handleApiError = async (action: UnknownAction): Promise<void> => {
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
};
