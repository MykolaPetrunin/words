import reducer, { setLoading, setUser, setUserLocale, type CurrentUserState } from '@/lib/redux/slices/currentUserSlice';

const initial: CurrentUserState = { user: null, loading: false };

describe('currentUserSlice', () => {
    it('should return initial state by default', () => {
        expect(reducer(undefined, { type: '@@INIT' })).toEqual(initial);
    });

    it('setLoading toggles loading', () => {
        let state = reducer(initial, setLoading(true));
        expect(state.loading).toBe(true);
        state = reducer(state, setLoading(false));
        expect(state.loading).toBe(false);
    });

    it('setUser sets user and locale', () => {
        const user = {
            id: '1',
            firebaseId: 'f1',
            email: 'a@b.com',
            firstName: 'John',
            lastName: 'Doe',
            locale: 'uk' as const,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        };
        const state = reducer(initial, setUser(user));
        expect(state.user?.email).toBe('a@b.com');
    });

    it('setUserLocale updates locale only when user exists', () => {
        let state = reducer(initial, setUserLocale('en'));
        expect(state.user).toBeNull();

        state = reducer(
            {
                user: {
                    id: '1',
                    firebaseId: 'f1',
                    email: 'a@b.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    locale: 'uk',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                loading: false
            },
            setUserLocale('en')
        );
        expect(state.user?.locale).toBe('en');
    });
});
