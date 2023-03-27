import express from 'express';

import { createUrl } from '../controllers/urlController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createUrl);

export default router;
