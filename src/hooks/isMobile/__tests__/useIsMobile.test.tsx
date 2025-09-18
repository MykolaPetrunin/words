import { act, renderHook } from '@testing-library/react';

import { useIsMobile } from '../useIsMobile';

describe('useIsMobile', () => {
    const originalInnerWidth = global.innerWidth;

    beforeEach(() => {
        global.innerWidth = 1024;
        const listeners: Array<(e: MediaQueryListEvent) => void> = [];
        const mql: MediaQueryList = {
            matches: false,
            media: '(max-width: 767px)',
            onchange: null,
            addEventListener: (_type: 'change', listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => {
                listeners.push(listener);
            },
            removeEventListener: (_type: 'change', listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => {
                const idx = listeners.indexOf(listener as unknown as (e: MediaQueryListEvent) => void);
                if (idx >= 0) listeners.splice(idx, 1);
            },
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: (event: Event) => {
                listeners.forEach((l) => l(event as MediaQueryListEvent));
                return true;
            }
        } as unknown as MediaQueryList;

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: () => mql
        });
    });

    afterEach(() => {
        global.innerWidth = originalInnerWidth;
    });

    test('initial value reflects window.innerWidth', () => {
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    test('updates on change event according to innerWidth', () => {
        const { result } = renderHook(() => useIsMobile());

        act(() => {
            global.innerWidth = 500;
            // trigger change
            window.matchMedia('(max-width: 767px)').dispatchEvent(new Event('change'));
        });

        expect(result.current).toBe(true);

        act(() => {
            global.innerWidth = 900;
            window.matchMedia('(max-width: 767px)').dispatchEvent(new Event('change'));
        });

        expect(result.current).toBe(false);
    });
});
