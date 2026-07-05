import { server } from './app.js';
import { serverConfig } from './utils/env.config.js';
import Logger from './logging/logger.js';

const { PORT, HOSTNAME } = serverConfig;

server.listen(PORT, HOSTNAME, () => {
    Logger.debug(`Server started on ${HOSTNAME ?? 'localhost'}:${PORT}`);
});
