import apicache from 'apicache';
import { Request, Response, NextFunction } from 'express';
import { CACHE_TIME, isTest } from './env.config.js';

const cacher = isTest 
    ? (req: Request, res: Response, next: NextFunction) => next()
    : apicache.middleware(CACHE_TIME);

export default cacher;
