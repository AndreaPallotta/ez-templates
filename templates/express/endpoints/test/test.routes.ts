import { Router } from 'express';
import { validateToken } from '../../auth/jwt.js';
import { testGet, testPost } from './test.controller.js';
import { validateGET, validatePOST } from './test.validator.js';

const router = Router();

router.get('/test-get/:username', [validateToken, validateGET], testGet);
router.post('/test-post', validatePOST, testPost);

export default router;
