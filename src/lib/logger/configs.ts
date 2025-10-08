import { LoggerConfig, LogLevel } from './types';

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isPrettyEnabled = process.env.LOG_PRETTY === 'true';

const validLogLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

const getLogLevel = (): LogLevel => {
    const envLogLevel = process.env.LOG_LEVEL;
    if (envLogLevel && validLogLevels.includes(envLogLevel as LogLevel)) {
        return envLogLevel as LogLevel;
    }
    return isDevelopment ? 'debug' : 'info';
};

export const defaultConfig: LoggerConfig = {
    level: getLogLevel(),
    name: process.env.LOGGER_NAME || 'words-next',
    prettyPrint: isDevelopment && !isTest && isPrettyEnabled,
    redact: ['password', 'token', 'idToken', 'secret', 'key', 'authorization']
};

export const serverConfig: LoggerConfig = {
    ...defaultConfig,
    name: 'words-next-server'
};

export const clientConfig: LoggerConfig = {
    ...defaultConfig,
    name: 'words-next-client',
    level: isTest ? 'fatal' : defaultConfig.level
};

export const testConfig: LoggerConfig = {
    ...defaultConfig,
    level: 'fatal'
};
