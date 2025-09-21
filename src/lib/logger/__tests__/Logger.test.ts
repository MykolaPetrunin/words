import pino from 'pino';

import { PinoLogger } from '../Logger';
import { LoggerConfig } from '../types';

jest.mock('pino');

const mockPino = pino as jest.MockedFunction<typeof pino>;

describe('PinoLogger', () => {
    let mockPinoInstance: jest.Mocked<pino.Logger>;
    let logger: PinoLogger;

    beforeEach(() => {
        mockPinoInstance = {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            fatal: jest.fn()
        } as unknown as jest.Mocked<pino.Logger>;

        mockPino.mockReturnValue(mockPinoInstance);

        const config: LoggerConfig = {
            level: 'debug',
            name: 'test-logger',
            prettyPrint: false,
            redact: ['password']
        };

        logger = new PinoLogger(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log debug messages with context', () => {
        const message = 'Debug message';
        const context = { userId: '123' };

        logger.debug(message, context);

        expect(mockPinoInstance.debug).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: '123',
                timestamp: expect.any(String),
                environment: 'test'
            }),
            message
        );
    });

    it('should log info messages', () => {
        const message = 'Info message';

        logger.info(message);

        expect(mockPinoInstance.info).toHaveBeenCalledWith(
            expect.objectContaining({
                timestamp: expect.any(String),
                environment: 'test'
            }),
            message
        );
    });

    it('should log errors with error object', () => {
        const message = 'Error occurred';
        const error = new Error('Test error');
        const context = { route: '/api/test' };

        logger.error(message, error, context);

        expect(mockPinoInstance.error).toHaveBeenCalledWith(
            expect.objectContaining({
                route: '/api/test',
                error: {
                    name: 'Error',
                    message: 'Test error',
                    stack: expect.any(String),
                    cause: undefined
                }
            }),
            message
        );
    });

    it('should log fatal errors', () => {
        const message = 'Fatal error';
        const error = new Error('Critical failure');

        logger.fatal(message, error);

        expect(mockPinoInstance.fatal).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    name: 'Error',
                    message: 'Critical failure'
                })
            }),
            message
        );
    });
});
