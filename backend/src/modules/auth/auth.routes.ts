import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
