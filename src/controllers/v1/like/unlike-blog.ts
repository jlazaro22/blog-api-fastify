import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import Blog from 'models/blog';
import Like from 'models/like';
import {
  likeUnlikeBlogBodySchema,
  likeUnlikeBlogParamsSchema,
} from './validations/like-validation-schemas';

export async function unlikeBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { blogId } = likeUnlikeBlogParamsSchema.parse(request.params);
  const { userId } = likeUnlikeBlogBodySchema.parse(request.body);

  try {
    const existingLike = await Like.findOne({
      blogId,
      userId,
    })
      .lean()
      .exec();

    if (!existingLike) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Like not found.',
      });
    }

    await Like.deleteOne({
      _id: existingLike._id,
    });

    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    blog.likesCount--;
    await blog.save();
    app.log.info(
      { userId, blogId: blog._id, likesCount: blog.likesCount },
      'Blog unliked successfully.',
    );

    reply.code(204);
  } catch (err) {
    app.log.error(err, 'Error while unliking the blog.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
