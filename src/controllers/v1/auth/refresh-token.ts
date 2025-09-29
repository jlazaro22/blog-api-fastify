import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';

import { app } from 'app';
import { env } from 'env';
import { generateAccessToken, generateRefreshToken } from 'lib/jwt';

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify({ onlyCookie: true });

    const { sub: userId, role } = request.user;

    const accessToken = await generateAccessToken(
      reply,
      new Types.ObjectId(userId),
      role,
    );
    const refreshToken = await generateRefreshToken(
      reply,
      new Types.ObjectId(userId),
      role,
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(200)
      .send({
        accessToken,
      });
  } catch (err) {
    app.log.error(err, 'Error during  refresh token.');
    return reply.code(401).send({ message: 'Unauthorized.' });
  }
}
