import { FastifyJWTOptions } from '@fastify/jwt';
import { env } from '../env/index.js';

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
