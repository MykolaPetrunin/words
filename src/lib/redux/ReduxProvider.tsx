'use client';

import { configureStore } from '@reduxjs/toolkit';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { objectsApi } from './api/objectsApi';
import { userApi } from './api/userApi';
import { apiErrorListener } from './middlewares/apiErrorListener';
import counterReducer from './slices/counterSlice';
import currentUserReducer from './slices/currentUserSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        currentUser: currentUserReducer,
        [objectsApi.reducerPath]: objectsApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiErrorListener.middleware).concat(objectsApi.middleware, userApi.middleware)
});

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
