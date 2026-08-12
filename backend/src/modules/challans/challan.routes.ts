import { Router } from 'express';
import { ChallanController } from './challan.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  ChallanController.getChallans
);

router.get(
  '/:id',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  ChallanController.getChallanById
);

router.post(
  '/',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  ChallanController.createChallan
);

router.put(
  '/:id',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  ChallanController.updateChallan
);

router.post(
  '/:id/confirm',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  ChallanController.confirmChallan
);

router.post(
  '/:id/cancel',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  ChallanController.cancelChallan
);

export default router;
