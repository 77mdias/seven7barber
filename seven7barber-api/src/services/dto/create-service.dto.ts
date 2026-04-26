import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  duration: z.number().int().min(15, 'Duration must be at least 15 minutes'),
  price: z.number().min(0, 'Price must be a positive number'),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
