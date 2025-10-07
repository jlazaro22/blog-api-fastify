import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import Blog from 'models/blog';
import Comment from 'models/comment';
import User from 'models/user';
import { Types } from 'mongoose';
import { deleteCommentParamsSchema } from './validations/comment-validation-schemas';

export async function deleteComment(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const currentUserId = request.user.sub;
  const { commentId } = deleteCommentParamsSchema.parse(request.params);

  try {
    const user = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();

    if (!comment) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Comment not found.',
      });
    }

    if (
      comment.userId !== new Types.ObjectId(currentUserId) &&
      user?.role !== 'admin'
    ) {
      app.log.warn(
        { userId: currentUserId, comment },
        'A user tried to delete a comment without permissions.',
      );

      return reply.code(403).send({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }

    await Comment.deleteOne({ _id: commentId });
    app.log.info({ commentId }, 'Comment deleted successfully.');

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    blog.commentsCount--;
    await blog.save();
    app.log.info(
      { blogId: blog._id, commentsCount: blog.commentsCount },
      'Blog comments count updated.',
    );

    reply.code(204);
  } catch (err) {
    app.log.error(err, 'Error deleting comment.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
