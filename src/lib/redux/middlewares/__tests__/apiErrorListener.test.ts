import { apiErrorListener } from '../apiErrorListener';

const mockAlert = jest.fn();
global.alert = mockAlert;

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

    it('should handle listener configuration', () => {
        expect(apiErrorListener).toHaveProperty('startListening');
        expect(apiErrorListener).toHaveProperty('stopListening');
        expect(apiErrorListener).toHaveProperty('clearListeners');
    });
});
