import { configureStore } from '@reduxjs/toolkit';

import { objectsApi } from './api/objectsApi';
import { apiErrorListener } from './middlewares/apiErrorListener';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [objectsApi.reducerPath]: objectsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiErrorListener.middleware).concat(objectsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
