/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';
import * as path from 'path';

dns.setDefaultResultOrder('verbatim');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const envValues = {
    'process.env': Object.entries(env).reduce(
      (prev, [k, v]) => ({
        ...prev,
        [k]: v,
      }),
      {}
    ),
  };

  return {
    plugins: [react()],
    define: envValues,
    server: {
      host: env.VITE_APP_HOST || 'localhost',
      port: env.VITE_APP_PORT || 8080,
      strictPort: true,
      https: env.VITE_USE_HTTPS === 'true',
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
  };
});
