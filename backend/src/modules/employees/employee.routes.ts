import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authMiddleware, roleMiddleware([Role.ADMIN]));

router.get('/stats', EmployeeController.getStats);
router.get('/', EmployeeController.getEmployees);
router.get('/:id', EmployeeController.getEmployeeById);
router.post('/', EmployeeController.createEmployee);
router.put('/:id', EmployeeController.updateEmployee);
router.patch('/:id/status', EmployeeController.toggleStatus);

export default router;
