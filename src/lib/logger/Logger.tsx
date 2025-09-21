import pino from 'pino';

import { LogContext, Logger, LoggerConfig } from './types';
import { createLogContext, sanitizeError } from './utils';

export class PinoLogger implements Logger {
    private pinoInstance: pino.Logger;

    constructor(config: LoggerConfig) {
        this.pinoInstance = pino({
            name: config.name,
            level: config.level,
            redact: [...config.redact],
            ...(config.prettyPrint && {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        translateTime: 'SYS:standard',
                        ignore: 'pid,hostname'
                    }
                }
            })
        });
    }

    debug(message: string, context?: LogContext): void {
        this.pinoInstance.debug(createLogContext(context), message);
    }

    info(message: string, context?: LogContext): void {
        this.pinoInstance.info(createLogContext(context), message);
    }

    warn(message: string, context?: LogContext): void {
        this.pinoInstance.warn(createLogContext(context), message);
    }

    error(message: string, error?: Error, context?: LogContext): void {
        const logContext = createLogContext({
            ...context,
            ...(error && { error: sanitizeError(error) })
        });
        this.pinoInstance.error(logContext, message);
    }

    fatal(message: string, error?: Error, context?: LogContext): void {
        const logContext = createLogContext({
            ...context,
            ...(error && { error: sanitizeError(error) })
        });
        this.pinoInstance.fatal(logContext, message);
    }
}
