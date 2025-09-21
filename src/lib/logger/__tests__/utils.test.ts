import { createLogContext, createRequestContext, sanitizeError } from '../utils';

describe('Logger Utils', () => {
    describe('createLogContext', () => {
        it('should create log context with default values', () => {
            const context = createLogContext();

            expect(context).toEqual({
                timestamp: expect.any(String),
                environment: 'test'
            });
        });

        it('should merge base context', () => {
            const baseContext = { userId: '123', route: '/test' };
            const context = createLogContext(baseContext);

            expect(context).toEqual({
                timestamp: expect.any(String),
                environment: 'test',
                userId: '123',
                route: '/test'
            });
        });
    });

    describe('sanitizeError', () => {
        it('should sanitize error object', () => {
            const error = new Error('Test error');
            error.cause = 'Root cause';

            const sanitized = sanitizeError(error);

            expect(sanitized).toEqual({
                name: 'Error',
                message: 'Test error',
                stack: expect.any(String),
                cause: 'Root cause'
            });
        });
    });

    describe('createRequestContext', () => {
        it('should create request context', () => {
            const context = createRequestContext('/api/test', 'POST', 'Mozilla/5.0', '192.168.1.1');

            expect(context).toEqual({
                timestamp: expect.any(String),
                environment: 'test',
                route: '/api/test',
                method: 'POST',
                userAgent: 'Mozilla/5.0',
                ip: '192.168.1.1'
            });
        });

        it('should handle undefined values', () => {
            const context = createRequestContext();

            expect(context).toEqual({
                timestamp: expect.any(String),
                environment: 'test',
                route: undefined,
                method: undefined,
                userAgent: undefined,
                ip: undefined
            });
        });
    });
});
