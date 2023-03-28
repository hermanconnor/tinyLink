import express from 'express';

import {
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { getUserLinks } from '../controllers/urlController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:id', verifyToken, getUserLinks);
router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;
