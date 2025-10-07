import { Types } from 'mongoose';
import z from 'zod';

export const likeUnlikeBlogParamsSchema = z.object({
  blogId: z
    .string('Blog ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid blog ID'),
});

export const likeUnlikeBlogBodySchema = z.object({
  userId: z
    .string('User ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid user ID'),
});
