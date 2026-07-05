import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const { NODE_ENV, PORT, HOST, LOG_LEVEL, SECRET, CACHE_TIME: envCacheTime, SECURE_TESTS: envSecureTests } =
    process.env;
const env = NODE_ENV || 'development';

export const isDev = env === 'development';
export const isTest = env === 'test';
export const isProd = env === 'production';

const logLevels = ['error', 'warn', 'info', 'http', 'debug'];

export const expressConfig = {
    PORT: PORT ? parseInt(PORT, 10) : 8081,
    HOSTNAME: HOST,
};

export const getLogLevel = (): string => {
    if (!LOG_LEVEL || !logLevels.includes(LOG_LEVEL)) {
        return isDev ? 'debug' : 'warn';
    }
    return LOG_LEVEL;
};

export const JWT_SECRET = SECRET ?? 'development_jwt_secret_key_12345';
export const CACHE_TIME = envCacheTime ?? '2 minutes';
export const SECURE_TESTS = envSecureTests === 'true';
