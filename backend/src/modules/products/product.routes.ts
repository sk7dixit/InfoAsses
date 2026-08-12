import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  ProductController.getProducts
);

router.get(
  '/:id',
  roleMiddleware([Role.ADMIN, Role.SALES, Role.WAREHOUSE, Role.ACCOUNTS]),
  ProductController.getProductById
);

router.post(
  '/',
  roleMiddleware([Role.ADMIN, Role.WAREHOUSE]),
  upload.single('image'),
  ProductController.createProduct
);

router.put(
  '/:id',
  roleMiddleware([Role.ADMIN, Role.WAREHOUSE]),
  upload.single('image'),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  roleMiddleware([Role.ADMIN]),
  ProductController.deleteProduct
);

export default router;
