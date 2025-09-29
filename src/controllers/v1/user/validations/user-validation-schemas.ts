import z from 'zod';

export const updateCurrentUserBodySchema = z.object({
  username: z
    .string()
    .trim()
    .max(20, 'Username must be less than 20 characters long')
    .optional(),
  email: z
    .email('Invalid email address')
    .trim()
    .max(50, 'Email must be less than 50 characters long')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .optional(),
  firstName: z
    .string()
    .trim()
    .max(20, 'First name must be less than 20 characters long')
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(20, 'Last name must be less than 20 characters long')
    .optional(),
  website: z.url('Invalid URL').optional(),
  facebook: z.url('Invalid URL').optional(),
  instagram: z.url('Invalid URL').optional(),
  x: z.url('Invalid URL').optional(),
  youtube: z.url('Invalid URL').optional(),
  linkedin: z.url('Invalid URL').optional(),
});
