'use client';

import { configureStore } from '@reduxjs/toolkit';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { objectsApi } from './api/objectsApi';
import { apiErrorListener } from './middlewares/apiErrorListener';
import counterReducer from './slices/counterSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [objectsApi.reducerPath]: objectsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiErrorListener.middleware).concat(objectsApi.middleware)
});

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
