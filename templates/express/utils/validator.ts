import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (const validation of validations) {
            const result = await validation.run(req) as any;
            if (result.errors?.length) break;
        }
        const errors = validationResult(req);

        if (errors.isEmpty()) return next();

        const errorMessages = errors
            .array()
            .filter((err) => err.msg !== undefined)
            .map((err) => err.msg);

        return res
            .status(400)
            .json({ error: `Invalid Fields - ${errorMessages.join(',')}` });
    };
};

export default validate;
