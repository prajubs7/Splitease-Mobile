import { z } from 'zod';

// Mirrors the backend validation (LoginRequest / RegisterRequest).
const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(255, 'At most 255 characters')
  .pipe(z.email('Enter a valid email'));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'At most 100 characters'),
  email,
  password: z.string().min(8, 'At least 8 characters').max(72, 'At most 72 characters'),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
