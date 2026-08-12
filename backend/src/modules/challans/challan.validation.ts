import { z } from 'zod';

export const challanItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const createChallanSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  items: z.array(challanItemSchema).min(1, 'At least one product item is required'),
});

export const updateChallanSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(challanItemSchema).min(1).optional(),
});

export type CreateChallanInput = z.infer<typeof createChallanSchema>;
export type UpdateChallanInput = z.infer<typeof updateChallanSchema>;
