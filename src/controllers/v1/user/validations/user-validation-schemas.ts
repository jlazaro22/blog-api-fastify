import config from 'config';
import { Types } from 'mongoose';
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

export const getAllUsersQuerySchema = z.object({
  limit: z.coerce
    .number()
    .min(1, 'Limit must be between 1 and 50')
    .max(50, 'Limit must be between 1 and 50')
    .default(config.defaultResLimit)
    .optional()
    .refine((value) => Number.isInteger(value), 'Limit must be an integer'),
  offset: z.coerce
    .number()
    .min(0, 'Offset must be a positive number')
    .default(config.defaultResOffset)
    .optional()
    .refine((value) => Number.isInteger(value), 'Offset must be an integer'),
});

export const getOrDeleteUserByIdParamsSchema = z.object({
  userId: z
    .string('User ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid user ID'),
});
