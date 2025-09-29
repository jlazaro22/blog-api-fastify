import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import User from 'models/user';
import { getOrDeleteUserByIdParamsSchema } from './validations/user-validation-schemas';

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { userId } = getOrDeleteUserByIdParamsSchema.parse(request.params);

    const user = await User.findById(userId).select('-__v').exec();

    if (!user) {
      return reply.code(404).send({
        code: 'NotFoundError',
        message: 'User not found.',
      });
    }

    return reply.code(200).send({ user });
  } catch (err) {
    app.log.error(err, 'Error while getting the user.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
