import { v2 as cloudinary } from 'cloudinary';
import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import Blog from 'models/blog';
import User from 'models/user';
import { getOrDeleteUserByIdParamsSchema } from './validations/user-validation-schemas';

export async function deleteUserById(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { userId } = getOrDeleteUserByIdParamsSchema.parse(request.params);

  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = blogs.map(({ banner }) => banner.publicId);

    await cloudinary.api.delete_resources(publicIds);
    app.log.info(
      {
        publicIds,
      },
      'Multiple blog banners deleted from Cloudinary.',
    );

    await Blog.deleteMany({ author: userId });
    app.log.info({ userId, blogs }, 'Multiple blogs deleted.');

    await User.deleteOne({ _id: userId });
    app.log.info({ userId }, 'User account deleted successfully.');

    reply.code(204);
  } catch (err) {
    app.log.error(err, 'Error while deleting the user.');
    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
