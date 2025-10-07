import DOMPurify from 'dompurify';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JSDOM } from 'jsdom';

import { app } from 'app';
import Blog from 'models/blog';
import Comment from 'models/comment';
import {
  commentBlogBodySchema,
  commentBlogParamsSchema,
} from './validations/comment-validation-schemas';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export async function commentBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { content } = commentBlogBodySchema.parse(request.body);
  const { blogId } = commentBlogParamsSchema.parse(request.params);
  const userId = request.user.sub;

  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      userId,
      content: cleanContent,
    });
    app.log.info(newComment, 'New comment created.');

    blog.commentsCount++;
    await blog.save();
    app.log.info(
      { blogId: blog._id, commentsCount: blog.commentsCount },
      'Blog comments count updated.',
    );

    return reply.code(201).send({
      comment: newComment,
    });
  } catch (err) {
    app.log.error(err, 'Error adding a comment to a blog.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
