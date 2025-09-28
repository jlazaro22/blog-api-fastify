import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from '../../../app';
import { env } from '../../../env';
import Token from '../../../models/token';

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { sub: userId } = request.user;

  try {
    await Token.deleteMany({ userId });

    app.log.info(
      {
        userId,
      },
      'User logged out successfully.',
    );

    reply
      .clearCookie('refreshToken', {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(204);
  } catch (err) {
    app.log.error(err, 'Error during user logout.');
    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
