import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get(
  '/movements',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  InventoryController.getMovements
);

router.get(
  '/low-stock',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  InventoryController.getLowStock
);

router.post(
  '/movements',
  roleMiddleware([Role.ADMIN, Role.WAREHOUSE]),
  InventoryController.createMovement
);

export default router;
