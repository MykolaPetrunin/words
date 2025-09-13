import { createListenerMiddleware } from '@reduxjs/toolkit';

import { checkIsObjectsApiRejected, handleApiError } from './apiErrorListenerHelpers';

export const apiErrorListener = createListenerMiddleware();

apiErrorListener.startListening({
    predicate: checkIsObjectsApiRejected,
    effect: handleApiError
});
