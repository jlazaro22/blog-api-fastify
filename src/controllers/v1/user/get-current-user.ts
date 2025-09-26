import { FastifyReply, FastifyRequest } from 'fastify';
import { app } from '../../../app.js';
import User from '../../../models/user.js';

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { sub: userId } = request.user;

  try {
    const user = await User.findById(userId).select('-__v').lean().exec();

    return reply.code(200).send({ user });
  } catch (err) {
    app.log.error(err, 'Error while getting the current user.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
