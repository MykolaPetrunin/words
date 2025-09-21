import { act, renderHook } from '@testing-library/react';
import React from 'react';

import ReduxProvider, { store } from '@/lib/redux/ReduxProvider';
import { setUser } from '@/lib/redux/slices/currentUserSlice';

import { useUpdateHtmlLang } from '../../../hooks/useUpdateHtmlLang';

const Wrapper = ({ children }: { children: React.ReactNode }) => <ReduxProvider>{children}</ReduxProvider>;

describe('useUpdateHtmlLang', () => {
    beforeEach(() => {
        store.dispatch(setUser(null));
        document.documentElement.lang = 'en';
    });

    it('should update document lang when user locale changes', () => {
        renderHook(() => useUpdateHtmlLang(), { wrapper: Wrapper });

        expect(document.documentElement.lang).toBe('en');
        act(() => {
            store.dispatch(
                setUser({
                    id: 'test-id',
                    firebaseId: 'test-firebase-id',
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    locale: 'uk',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                })
            );
        });

        expect(document.documentElement.lang).toBe('uk');
        act(() => {
            store.dispatch(
                setUser({
                    id: 'test-id',
                    firebaseId: 'test-firebase-id',
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    locale: 'en',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                })
            );
        });

        expect(document.documentElement.lang).toBe('en');
    });

    it('should not update lang when locale is undefined', () => {
        document.documentElement.lang = 'fr';

        renderHook(() => useUpdateHtmlLang(), { wrapper: Wrapper });

        expect(document.documentElement.lang).toBe('fr');
    });
});
