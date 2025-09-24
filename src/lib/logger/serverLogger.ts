import { serverConfig, testConfig } from './configs';
import { PinoLogger } from './Logger';

const cfg = process.env.NODE_ENV === 'test' ? testConfig : serverConfig;
export const serverLogger = new PinoLogger(cfg);
