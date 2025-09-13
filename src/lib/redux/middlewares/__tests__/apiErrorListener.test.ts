import { apiErrorListener } from '../apiErrorListener';

describe('apiErrorListener', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(apiErrorListener).toBeDefined();
        expect(apiErrorListener.middleware).toBeDefined();
    });

    it('should have middleware configured correctly', () => {
        const middleware = apiErrorListener.middleware;
        expect(middleware).toBeDefined();
        expect(typeof middleware).toBe('function');
    });

    it('should have listener configuration methods', () => {
        expect(apiErrorListener).toHaveProperty('startListening');
        expect(apiErrorListener).toHaveProperty('stopListening');
        expect(apiErrorListener).toHaveProperty('clearListeners');
    });

    it('should be a listener middleware instance', () => {
        expect(apiErrorListener.middleware).toBeDefined();
        expect(typeof apiErrorListener.startListening).toBe('function');
        expect(typeof apiErrorListener.stopListening).toBe('function');
        expect(typeof apiErrorListener.clearListeners).toBe('function');
    });
});
