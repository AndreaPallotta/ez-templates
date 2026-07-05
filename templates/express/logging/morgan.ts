import morgan from 'morgan';
import { Request, Response } from 'express';
import { isDev } from '../utils/env.config.js';
import Logger from './logger.js';

const stream = {
    write: (message: string) => Logger.http(message.trim()),
};

const skip = (_: Request, res: Response) => {
    return isDev ? false : res.statusCode < 400;
};

const morganMid = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);

export default morganMid;
