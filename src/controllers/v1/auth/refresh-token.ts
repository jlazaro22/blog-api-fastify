import { FastifyReply, FastifyRequest } from 'fastify';

import { Types } from 'mongoose';
import { app } from '../../../app.js';
import { env } from '../../../env/index.js';
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.js';

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
    app.log.error(err, 'Error during authentication.');
    return reply.status(401).send({ message: 'Unauthorized.' });
  }
}
