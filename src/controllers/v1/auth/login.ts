import { compare } from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { app } from '../../../app.js';
import { env } from '../../../env/index.js';
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt.js';
import Token from '../../../models/token.js';
import User from '../../../models/user.js';

export async function login(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const loginBodySchema = z.object({
    email: z
      .email('Invalid email address')
      .trim()
      .max(50, 'Email must be less than 50 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  });

  const { email, password } = loginBodySchema.parse(request.body);

  try {
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      return reply.code(401).send({
        code: 'AuthenticationError',
        message: 'Invalid credentials.',
      });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return reply.code(401).send({
        code: 'AuthenticationError',
        message: 'Invalid credentials.',
      });
    }

    const accessToken = await generateAccessToken(reply, user._id, user.role);
    const refreshToken = await generateRefreshToken(reply, user._id, user.role);

    // await Token.create({
    //   token: refreshToken,
    //   userId: user._id,
    // });

    // app.log.info(
    //   {
    //     userId: user._id,
    //     token: refreshToken,
    //   },
    //   'Refresh token created.',
    // );

    app.log.info(
      {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      'User logged in successfully.',
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(201)
      .send({
        user: { username: user.username, email: user.email, role: user.role },
        accessToken,
      });
  } catch (err) {
    app.log.error(err, 'Error during user login.');
    throw err;
  }
}
