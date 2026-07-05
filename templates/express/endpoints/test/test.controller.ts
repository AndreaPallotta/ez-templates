import { Request, Response } from 'express';
import Logger from '../../logging/logger.js';
import { newTokens } from '../../auth/jwt.js';

export const testGet = async (req: Request, res: Response) => {
    const { username } = req.params;
    Logger.debug(`GET /test/test-get/${username}`);
    return res.status(404).send({ error: 'Data not found' });
};

export const testPost = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const tokens = newTokens(email);
        if (!tokens) {
            return res.status(500).send({ error: 'Failed to generate tokens' });
        }
        return res.json(tokens);
    } catch (err: any) {
        return res.status(500).send({ error: err.message });
    }
};
