import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const { NODE_ENV, HOST, PORT, ORIGIN, LOG_LEVEL } = process.env;

const env = NODE_ENV || 'development';

export const isDev = env === 'development';
export const isTest = env === 'test';
export const isProd = env === 'production';
const logLevels = ['error', 'warn', 'info', 'http', 'debug'];

const PORT_NUMBER = PORT ? parseInt(PORT, 10) : 8081;
const CORS_ORIGIN = ORIGIN ?? `http://${HOST || 'localhost'}:${PORT_NUMBER}`;

export const serverConfig = {
    PORT: PORT_NUMBER,
    HOSTNAME: HOST,
    ORIGIN: CORS_ORIGIN,
};

export const getLogLevel = (): string => {
    if (!LOG_LEVEL || !logLevels.includes(LOG_LEVEL)) {
        return isDev ? 'debug' : 'warn';
    }
    return LOG_LEVEL;
};
