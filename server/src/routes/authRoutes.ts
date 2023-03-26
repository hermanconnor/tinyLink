import express from 'express';
import { loginUser, logoutUser } from '../controllers/authController';

const router = express.Router();

router.post('/', loginUser);

router.post('/logout', logoutUser);

// router.get('/refresh', refresh)

export default router;
