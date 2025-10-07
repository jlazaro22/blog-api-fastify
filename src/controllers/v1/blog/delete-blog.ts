import { v2 as cloudinary } from 'cloudinary';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';

import { app } from 'app';
import Blog from 'models/blog';
import User from 'models/user';
import { updateDeleteBlogParamsSchema } from './validations/blog-validation-schemas';

export async function deleteBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const userId = request.user.sub;
    const { blogId } = updateDeleteBlogParamsSchema.parse(request.params);

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!blog) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    if (blog.author !== new Types.ObjectId(userId) && user?.role !== 'admin') {
      app.log.warn(
        { userId, blog },
        'A user tried to update a blog without permissions.',
      );

      return reply.code(403).send({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }

    await cloudinary.uploader.destroy(blog.banner.publicId);
    app.log.info(
      { publicId: blog.banner.publicId },
      'Blog banner image deleted from Cloudinary.',
    );

    await Blog.deleteOne({ _id: blogId });
    app.log.info({ blogId }, 'Blog deleted successfully.');

    reply.code(204);
  } catch (err) {
    app.log.error(err, 'Error while deleting blog.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
