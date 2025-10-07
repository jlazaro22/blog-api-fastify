import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import uploadToCloudinary from 'lib/cloudinary';
import { parseMultipart } from 'lib/multipart';
import Blog from 'models/blog';
import User from 'models/user';
import { Types } from 'mongoose';
import {
  updateBlogBodySchema,
  updateBlogParamsSchema,
} from './validations/blog-validation-schemas';

export async function updateBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const userId = request.user.sub;
    const { blogId } = updateBlogParamsSchema.parse(request.params);

    const { fields, fileBuffer } = await parseMultipart('put', request, reply);
    const { title, content, status } = updateBlogBodySchema.parse(fields);

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

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

    if (fileBuffer) {
      const publicId = blog.banner.publicId;
      const data = await uploadToCloudinary(
        fileBuffer,
        publicId ? publicId.replace('blog-api/', '') : '',
      );

      if (!data) {
        app.log.error('Error while uploading blog banner image to cloudinary.');

        return reply.code(500).send({
          code: 'ServerError',
          message: 'Internal server error.',
        });
      }

      blog.banner.publicId = data.public_id;
      blog.banner.url = data.secure_url;
      blog.banner.width = data.width;
      blog.banner.height = data.height;
    }

    if (title) blog.title = title;
    if (content) blog.content = fields.content;
    if (status) blog.status = status;

    await blog.save();
    app.log.info({ blog }, 'Blog updated successfully.');

    reply.code(200).send({ blog });
  } catch (err) {
    app.log.error(err, 'Error while updating blog.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
