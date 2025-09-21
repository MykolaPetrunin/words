import { LoggerConfig } from './types';

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export const defaultConfig: LoggerConfig = {
    level: (process.env.LOG_LEVEL as LoggerConfig['level']) || (isDevelopment ? 'debug' : 'info'),
    name: process.env.LOGGER_NAME || 'words-next',
    prettyPrint: isDevelopment && !isTest,
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
