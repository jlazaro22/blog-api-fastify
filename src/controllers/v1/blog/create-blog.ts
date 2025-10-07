import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';

import { app } from 'app';
import uploadToCloudinary from 'lib/cloudinary';
import { parseMultipart } from 'lib/multipart';
import Blog, { IBlog } from 'models/blog';
import { createBlogBodySchema } from './validations/blog-validation-schemas';

export async function createBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;

  try {
    const { fields, fileBuffer } = await parseMultipart('post', request, reply);
    const { title, content, status } = createBlogBodySchema.parse(fields);

    if (!fileBuffer) {
      return reply.code(400).send({
        code: 'ValidationError',
        message: 'Blog banner image is required.',
      });
    }

    const data = await uploadToCloudinary(fileBuffer, '');

    if (!data) {
      app.log.error('Error while uploading blog banner image to cloudinary.');

      return reply.code(500).send({
        code: 'ServerError',
        message: 'Internal server error.',
      });
    }

    const newBanner: IBlog['banner'] = {
      publicId: data.public_id,
      url: data.url,
      width: data.width,
      height: data.height,
    };

    const newBlog = await Blog.create({
      title,
      content,
      banner: newBanner,
      status,
      author: new Types.ObjectId(userId),
    });

    app.log.info({ blog: newBlog }, 'Blog created successfully.');

    return reply.code(201).send({ blog: newBlog });
  } catch (err) {
    app.log.error(err, 'Error while creating the blog.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
