import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const RegisterDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(
      /[^A-Za-z0-9]/,
      'Senha deve conter pelo menos um caractere especial',
    ),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;
