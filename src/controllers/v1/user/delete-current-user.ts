import { app } from 'app';
import { v2 as cloudinary } from 'cloudinary';
import { env } from 'env';
import { FastifyReply, FastifyRequest } from 'fastify';
import Blog from 'models/blog';
import Token from 'models/token';
import User from 'models/user';

export async function deleteCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;

  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = blogs.map(({ banner }) => banner.publicId);

    if (publicIds?.length) {
      await cloudinary.api.delete_resources(publicIds);
    }

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

    const refreshToken = request.cookies.refreshToken;

    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });
      app.log.info(
        {
          userId,
          token: refreshToken,
        },
        'User refresh token deleted successfully.',
      );
    }

    reply
      .clearCookie('refreshToken', {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(204);
  } catch (err) {
    app.log.error(err, 'Error while deleting the current user.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
