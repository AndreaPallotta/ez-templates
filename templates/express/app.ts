import express from 'express';
import serveIndex from 'serve-index';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import morganMid from './logging/morgan.js';
import cacher from './utils/cache.js';
import { apiLimiter } from './auth/rateLimiter.js';

import testRoutes from './endpoints/test/test.routes.js';

const app = express();
app.use('/public', express.static('public'));
app.use('/public', serveIndex('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morganMid);
app.use(cacher);
app.use(apiLimiter);

// CORS pre-flight. Add before the rest of the routes.
app.options('*', (_, res) => {
    res.sendStatus(200);
});

app.use('/test', testRoutes);

export default app;
