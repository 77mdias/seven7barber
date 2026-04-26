import { z } from 'zod';
export declare const CreateServiceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    duration: z.ZodNumber;
    price: z.ZodNumber;
}, z.core.$strip>;
export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
