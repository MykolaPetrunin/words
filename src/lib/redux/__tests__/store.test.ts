import { decrement, increment, reset } from '../slices/counterSlice';
import { store } from '../store';

describe('Redux Store', () => {
    it('should have initial state', () => {
        const state = store.getState();
        expect(state).toHaveProperty('counter');
        expect(state.counter.value).toBe(0);
        expect(state).toHaveProperty('objectsApi');
    });

    it('should handle counter actions', () => {
        const initialValue = store.getState().counter.value;

        store.dispatch(increment());
        expect(store.getState().counter.value).toBe(initialValue + 1);

        store.dispatch(decrement());
        expect(store.getState().counter.value).toBe(initialValue);

        store.dispatch(reset());
        expect(store.getState().counter.value).toBe(0);
    });

    it('should have correct middleware configured', () => {
        const state = store.getState();
        expect(state).toHaveProperty('objectsApi');
        expect(state.objectsApi).toHaveProperty('queries');
        expect(state.objectsApi).toHaveProperty('mutations');
    });

    it('should export correct types', () => {
        const state: ReturnType<typeof store.getState> = store.getState();
        const dispatch: typeof store.dispatch = store.dispatch;

        expect(state).toBeDefined();
        expect(dispatch).toBeDefined();
    });
});
