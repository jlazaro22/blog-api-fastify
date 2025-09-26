import { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyReply } from 'fastify';
import { Types } from 'mongoose';

import { app } from '../app.js';
import { env } from '../env/index.js';
import Token from '../models/token.js';
import { IUser } from '../models/user.js';

export const jwtOptions: FastifyJWTOptions = {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  },
};

export async function generateAccessToken(
  reply: FastifyReply,
  userId: Types.ObjectId,
  role: IUser['role'],
) {
  return await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: String(userId),
        expiresIn: env.ACCESS_TOKEN_EXPIRY,
      },
    },
  );
}

export async function generateRefreshToken(
  reply: FastifyReply,
  userId: Types.ObjectId,
  role: IUser['role'],
) {
  const refreshToken = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: String(userId),
        expiresIn: env.REFRESH_TOKEN_EXPIRY,
      },
    },
  );

  await Token.deleteMany({ userId });

  await Token.create({
    token: refreshToken,
    userId: userId,
  });

  app.log.info(
    {
      userId: userId,
      token: refreshToken,
    },
    'Refresh token created.',
  );

  return refreshToken;
}
