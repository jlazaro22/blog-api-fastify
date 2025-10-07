import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import Blog from 'models/blog';
import Like from 'models/like';
import {
  likeUnlikeBlogBodySchema,
  likeUnlikeBlogParamsSchema,
} from './validations/like-validation-schemas';

export async function likeBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { blogId } = likeUnlikeBlogParamsSchema.parse(request.params);
  const { userId } = likeUnlikeBlogBodySchema.parse(request.body);

  try {
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    const existingLike = await Like.findOne({
      blogId,
      userId,
    })
      .lean()
      .exec();

    if (existingLike) {
      return reply.code(400).send({
        code: 'BadRequestError',
        message: 'You already liked this blog.',
      });
    }

    await Like.create({
      blogId,
      userId,
    });

    blog.likesCount++;
    await blog.save();
    app.log.info({ userId, blogId: blog._id }, 'Blog liked successfully.');

    return reply.code(200).send({ likesCount: blog.likesCount });
  } catch (err) {
    app.log.error(err, 'Error while liking the blog.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
