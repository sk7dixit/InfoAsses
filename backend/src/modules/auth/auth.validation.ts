import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
  role: z.string().optional(),
}).refine((data) => data.username || data.email, {
  message: 'Username or email is required',
  path: ['username'],
});

export type LoginInput = z.infer<typeof loginSchema>;
