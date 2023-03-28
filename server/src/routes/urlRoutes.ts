import express from 'express';

import {
  createUrl,
  getUrlByUrlCode,
  updateUrlCode,
  deleteUrlCode,
} from '../controllers/urlController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/:code', getUrlByUrlCode);
router.post('/', verifyToken, createUrl);
router.patch('/:code', verifyToken, updateUrlCode);
router.delete('/:code', verifyToken, deleteUrlCode);

export default router;
