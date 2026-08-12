import { Router } from 'express';
import { FollowUpController } from './followup.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get(
  '/upcoming',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  FollowUpController.getUpcoming
);

router.get(
  '/customer/:customerId',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  FollowUpController.getByCustomer
);

router.post(
  '/customer/:customerId',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  FollowUpController.create
);

export default router;
