import reducer, { decrement, increment, incrementByAmount, reset } from '../counterSlice';

interface CounterState {
    value: number;
}

describe('counterSlice', () => {
    const initialState: CounterState = { value: 0 };

    it('should handle initial state', () => {
        expect(reducer(undefined as unknown as CounterState, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should increment value', () => {
        const state: CounterState = { value: 0 };
        expect(reducer(state, increment())).toEqual({ value: 1 });
    });

    it('should decrement value', () => {
        const state: CounterState = { value: 1 };
        expect(reducer(state, decrement())).toEqual({ value: 0 });
    });

    it('should increment by amount', () => {
        const state: CounterState = { value: 1 };
        expect(reducer(state, incrementByAmount(5))).toEqual({ value: 6 });
    });

    it('should reset value', () => {
        const state: CounterState = { value: 10 };
        expect(reducer(state, reset())).toEqual({ value: 0 });
    });
});

