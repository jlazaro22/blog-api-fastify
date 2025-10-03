import { Types } from 'mongoose';
import z from 'zod';

export const createBlogBodySchema = z.object({
  title: z
    .string()
    .trim()
    .max(180, 'Title must be less than 180 characters long'),
  content: z.string(),
  status: z
    .enum(
      ['draft', 'published'],
      'Status must be either "draft" or "published"',
    )
    .optional()
    .default('draft'),
});

export const uploadBlogBannerParamsSchema = z.object({
  blogId: z
    .string()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid blog ID'),
});
