import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import Blog from 'models/blog';
import Comment from 'models/comment';
import { getCommentsByBlogIdParamsSchema } from './validations/comment-validation-schemas';

export async function getCommentsByBlogId(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { blogId } = getCommentsByBlogIdParamsSchema.parse(request.params);

  try {
    const blog = await Blog.findById(blogId).select('_id').lean().exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    const allComments = await Comment.find({ blogId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return reply.code(200).send({ comments: allComments });
  } catch (err) {
    app.log.error(err, 'Error retrieving blog comments.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
