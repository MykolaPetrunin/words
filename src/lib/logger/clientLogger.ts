import { clientConfig } from './configs';
import { PinoLogger } from './Logger';

export const clientLogger = new PinoLogger(clientConfig);
