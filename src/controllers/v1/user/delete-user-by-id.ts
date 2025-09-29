import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import User from 'models/user';
import { getOrDeleteUserByIdParamsSchema } from './validations/user-validation-schemas';

export async function deleteUserById(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { userId } = getOrDeleteUserByIdParamsSchema.parse(request.params);

  // TODO: delete <blogs> created by the user and corresponding <banner> images uploaded to cloudinary

  try {
    await User.deleteOne({ _id: userId });
    app.log.info({ userId }, 'User account deleted successfully.');

    reply.code(204);
  } catch (err) {
    app.log.error(err, 'Error while deleting the user.');
    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
