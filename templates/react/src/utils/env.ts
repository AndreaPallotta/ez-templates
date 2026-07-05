const {
  VITE_APP_NAME,
  VITE_APP_HOST,
  VITE_APP_PORT,
  VITE_SERVER_HOST,
  VITE_SERVER_PORT,
  VITE_USE_HTTPS,
  VITE_USE_JWT,
  MODE,
} = (import.meta as any).env || {};

export const app = {
  name: VITE_APP_NAME || 'Default title',
  isDev: MODE === 'development',
  prefix: VITE_USE_HTTPS === 'true' ? 'https://' : 'http://',
  useJWT: VITE_USE_JWT === 'true',
  isJWT: VITE_USE_JWT === 'true',
};

export const client = {
  host: VITE_APP_HOST || 'localhost',
  port: VITE_APP_PORT || 8080,
};

export const server = {
  host: VITE_SERVER_HOST || 'localhost',
  port: VITE_SERVER_PORT || 8081,
};

const env = { app, client, server };

export default env;
