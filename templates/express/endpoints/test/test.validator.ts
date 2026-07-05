import validate from '../../utils/validator.js';
import { param, body } from 'express-validator';

export const validateGET = validate([param('username').not().isEmpty()]);

export const validatePOST = validate([
    body('email', 'Invalid email').isEmail(),
    body('password', 'Invalid password').isLength({ min: 8, max: 25 }),
]);
