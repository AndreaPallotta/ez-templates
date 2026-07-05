import app from './app.js';
import Logger from './logging/logger.js';
import { expressConfig } from './utils/env.config.js';

const { PORT, HOSTNAME } = expressConfig;

app.listen(PORT, HOSTNAME, () => {
    Logger.debug(`Server started on ${HOSTNAME ?? 'localhost'}:${PORT}`);
});
