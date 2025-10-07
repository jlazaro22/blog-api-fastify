import { Types } from 'mongoose';
import z from 'zod';

export const commentBlogParamsSchema = z.object({
  blogId: z
    .string('Blog ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid blog ID'),
});

export const commentBlogBodySchema = z.object({
  content: z.string('Content is required.'),
});

export const getCommentsByBlogIdParamsSchema = z.object({
  blogId: z
    .string('Blog ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid blog ID'),
});

export const deleteCommentParamsSchema = z.object({
  commentId: z
    .string('Comment ID is required.')
    .trim()
    .refine((value) => Types.ObjectId.isValid(value), 'Invalid comment ID'),
});
