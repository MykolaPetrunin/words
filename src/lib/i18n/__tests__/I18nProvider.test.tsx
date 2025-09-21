import { renderHook } from '@testing-library/react';
import React from 'react';

import I18nProvider, { useI18nContext } from '@/lib/i18n/I18nProvider';

jest.mock('@/lib/redux/ReduxProvider', () => {
    const actual = jest.requireActual('@/lib/redux/ReduxProvider');
    return {
        ...actual,
        useAppSelector: (fn: (s: any) => any) => fn({ currentUser: { user: null } })
    };
});

describe('I18nProvider', () => {
    it('provides uk locale by default', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => <I18nProvider initialLocale={undefined}>{children}</I18nProvider>;
        const { result } = renderHook(() => useI18nContext(), { wrapper });
        expect(result.current.locale).toBe('uk');
        expect(result.current.t('common.save')).toBe('Зберегти');
    });

    it('respects initialLocale when provided', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => <I18nProvider initialLocale="en">{children}</I18nProvider>;
        const { result } = renderHook(() => useI18nContext(), { wrapper });
        expect(result.current.locale).toBe('en');
        expect(result.current.t('common.save')).toBe('Save');
    });

    it('throws when used without provider', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useI18nContext())).toThrow('useI18n must be used within an I18nProvider');
        consoleError.mockRestore();
    });
});
