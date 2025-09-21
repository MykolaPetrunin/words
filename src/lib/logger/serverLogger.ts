import { serverConfig } from './configs';
import { PinoLogger } from './Logger';

export const serverLogger = new PinoLogger(serverConfig);
