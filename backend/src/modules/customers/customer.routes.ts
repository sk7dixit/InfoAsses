import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  CustomerController.getCustomers
);

router.get(
  '/:id',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  CustomerController.getCustomerById
);

router.post(
  '/',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  CustomerController.createCustomer
);

router.put(
  '/:id',
  roleMiddleware([Role.ADMIN, Role.SALES]),
  CustomerController.updateCustomer
);

router.delete(
  '/:id',
  roleMiddleware([Role.ADMIN]),
  CustomerController.deleteCustomer
);

export default router;
