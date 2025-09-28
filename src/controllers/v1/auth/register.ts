import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { app } from '../../../app';
import config from '../../../config';
import User from '../../../models/user';
import { generateUsername } from '../../../utils';

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const registerBodySchema = z.object({
    email: z
      .email('Invalid email address')
      .trim()
      .max(50, 'Email must be less than 50 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum(['admin', 'user'], 'Role must be either "admin" or "user"'),
  });

  const { email, password, role } = registerBodySchema.parse(request.body);

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    app.log.warn(
      `User with email ${email} is trying to register as an admin but is not whitelisted.`,
    );

    return reply.code(403).send({
      code: 'AuthorizationError',
      message: ' You can not register as an admin.',
    });
  }

  try {
    const userExists = await User.exists({ email });

    if (userExists) {
      return reply.code(401).send({
        code: 'AuthenticationError',
        message: 'User already registered.',
      });
    }

    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    app.log.info(
      {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      'User registered successfully.',
    );

    return reply.code(201).send({
      message: 'User registered successfully.',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    app.log.error(err, 'Error during user registration.');
    throw err;
  }
}
