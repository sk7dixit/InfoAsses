import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import customerRoutes from '../modules/customers/customer.routes';
import followupRoutes from '../modules/followups/followup.routes';
import productRoutes from '../modules/products/product.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';
import challanRoutes from '../modules/challans/challan.routes';
import employeeRoutes from '../modules/employees/employee.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/customers', customerRoutes);
router.use('/follow-ups', followupRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/challans', challanRoutes);

export default router;
