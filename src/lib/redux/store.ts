import { configureStore } from '@reduxjs/toolkit';

import { objectsApi } from './api/objectsApi';
import { userApi } from './api/userApi';
import { apiErrorListener } from './middlewares/apiErrorListener';
import counterReducer from './slices/counterSlice';
import currentUserReducer from './slices/currentUserSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        currentUser: currentUserReducer,
        [objectsApi.reducerPath]: objectsApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiErrorListener.middleware).concat(objectsApi.middleware, userApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
