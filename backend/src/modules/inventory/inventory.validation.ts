import { z } from 'zod';
import { MovementType } from '@prisma/client';

export const createMovementSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  movementType: z.nativeEnum(MovementType),
  reason: z.string().min(2, 'Reason for movement is required'),
});

export type CreateMovementInput = z.infer<typeof createMovementSchema>;
