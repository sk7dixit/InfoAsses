import { z } from 'zod';
import { Role, EmploymentStatus } from '@prisma/client';

export const createEmployeeSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  employeeId: z.string().min(2, 'Employee ID is required (e.g. EMP-001)'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  role: z.nativeEnum(Role),
  joiningDate: z.string().or(z.date()).optional(),
  contractStart: z.string().or(z.date()).optional().nullable(),
  contractEnd: z.string().or(z.date()).optional().nullable(),
  status: z.nativeEnum(EmploymentStatus).default('ACTIVE'),
  loginEnabled: z.boolean().default(true),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
