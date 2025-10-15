import config from 'config';
import { Types } from 'mongoose';
import z from 'zod';

export const createBlogBodySchema = z.object({
  title: z
    .string('Title is required.')
    .trim()
    .max(180, 'Title must be less than 180 characters long'),
  content: z.string('Content is required.'),
  status: z
    .enum(
      ['draft', 'published'],
      'Status must be either "draft" or "published"',
    )
    .optional()
    .default('draft'),
});

export const getBlogsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .min(1, 'Limit must be between 1 and 50')
    .max(50, 'Limit must be between 1 and 50')
    .default(config.defaultResLimit)
    .optional(),
  offset: z.coerce
    .number()
    .min(0, 'Offset must be a positive number')
    .default(config.defaultResOffset)
    .optional(),
});

export const getBlogBySlugParamsSchema = z.object({
  slug: z.string('Slug is required').trim(),
});

export const getBlogsByUserIdParamsSchema = z.object({
  userId: z
    .string('User ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid user ID'),
});

export const updateDeleteBlogParamsSchema = z.object({
  blogId: z
    .string('Blog ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid blog ID'),
});

export const updateBlogBodySchema = z.object({
  title: z
    .string()
    .max(180, 'Title must be less than 180 characters long')
    .optional(),
  content: z.string().optional(),
  status: z
    .enum(
      ['draft', 'published'],
      'Status must be either "draft" or "published"',
    )
    .optional()
    .default('draft'),
});
