import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
