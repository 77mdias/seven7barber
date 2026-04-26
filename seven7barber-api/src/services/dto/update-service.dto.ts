import { z } from 'zod';

export const UpdateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  duration: z.number().int().min(15).optional(),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
