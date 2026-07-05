import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env.config.js';
import Logger from '../logging/logger.js';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tokenExp?: number;
      authToken?: string;
    }
  }
}

const generateJWTExpiration = (time: number = 6, format: string = 'h'): string | undefined => {
    let seconds = time;
    switch (format) {
        case 'h':
            seconds = time * 3600;
            break;
        case 'm':
            seconds = time * 60;
            break;
        case 's':
            break;
        default:
            Logger.error('Invalid JWT Expiration Format');
            return undefined;
    }
    if (seconds > 43200) {
        Logger.error('JWT Expiration is maxed at 12 hours');
        return undefined;
    }

    return `${seconds}s`;
};

const generateAuthJWT = (email: string, time?: number, format?: string): string | undefined => {
    if (!JWT_SECRET) {
        Logger.error('Generating JWTs requires Secret');
        return undefined;
    }
    const expiresIn = generateJWTExpiration(time, format);
    if (!expiresIn) return undefined;

    const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn,
    });
    Logger.debug(`New auth token generated for ${email}: ${token}`);
    return token;
};

const generateRefreshJWT = (email: string): string | undefined => {
    if (!JWT_SECRET) {
        Logger.error('Generating JWTs requires Secret');
        return undefined;
    }
    const token = jwt.sign({ email }, JWT_SECRET);
    Logger.debug(`New refresh token generated for ${email}: ${token}`);
    return token;
};

const generateBothJWT = (email: string, time?: number, format?: string) => {
    const authToken = generateAuthJWT(email, time, format);
    const refreshToken = generateRefreshJWT(email);

    if (!authToken || !refreshToken) return undefined;
    return { authToken, refreshToken };
};

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    if (!JWT_SECRET) {
        Logger.error('Validating JWTs requires Secret');
        return res.status(401).send({ error: 'Failed to authenticate JWT' });
    }
    const token = req.headers?.authorization?.split(' ')?.[1];

    if (!token) {
        Logger.error('401: Failed to authenticate JWT');
        return res.status(401).send({ error: 'Failed to authenticate JWT' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            Logger.error(`403: ${err.message}`);
            return res.status(401).send({ error: err.message });
        }

        req.userId = decoded?.email;
        req.tokenExp = decoded?.exp;
        req.authToken = token;

        next();
    });
};

export {
  generateAuthJWT as newAuthToken,
  generateRefreshJWT as newRefreshToken,
  generateBothJWT as newTokens,
  validateJWT as validateToken
};
