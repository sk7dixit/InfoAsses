import { z } from 'zod';

export const createFollowUpSchema = z.object({
  note: z.string().min(1, 'Follow-up note is required'),
  followUpDate: z.string().datetime({ message: 'Valid follow-up date-time is required' }),
});

export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;
