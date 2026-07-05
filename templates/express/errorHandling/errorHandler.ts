import { Request, Response, NextFunction } from 'express';
import { GenericError } from './GenericError.js';
import Logger from '../logging/logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    Logger.error(`Error caught in ${req.path}: ${err}`);
    if (err instanceof GenericError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;
