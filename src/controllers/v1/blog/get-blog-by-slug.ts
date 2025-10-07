import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import Blog from 'models/blog';
import User from 'models/user';
import { getBlogBySlugParamsSchema } from './validations/blog-validation-schemas';

export async function getBlogBySlug(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const userId = request.user.sub;
    const { slug } = getBlogBySlugParamsSchema.parse(request.params);

    const user = await User.findById(userId).select('role').lean().exec();

    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      app.log.error({ userId, blog }, 'A user tried to access a draft blog.');

      return reply.code(403).send({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }

    return reply.code(200).send({ blog });
  } catch (err) {
    app.log.error(err, 'Error while fetching blog by slug.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
