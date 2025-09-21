export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    route?: string;
    method?: string;
    userAgent?: string;
    ip?: string;
    [key: string]: unknown;
}

export interface LoggerConfig {
    level: LogLevel;
    name: string;
    prettyPrint: boolean;
    redact: ReadonlyArray<string>;
}

export interface Logger {
    debug: (message: string, context?: LogContext) => void;
    info: (message: string, context?: LogContext) => void;
    warn: (message: string, context?: LogContext) => void;
    error: (message: string, error?: Error, context?: LogContext) => void;
    fatal: (message: string, error?: Error, context?: LogContext) => void;
}
