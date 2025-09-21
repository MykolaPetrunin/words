import { LogContext } from './types';

export const createLogContext = (baseContext?: Partial<LogContext>): LogContext => ({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    ...baseContext
});

export const sanitizeError = (error: Error): Record<string, unknown> => ({
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause
});

export const createRequestContext = (route?: string, method?: string, userAgent?: string, ip?: string): LogContext =>
    createLogContext({
        route,
        method,
        userAgent,
        ip
    });
