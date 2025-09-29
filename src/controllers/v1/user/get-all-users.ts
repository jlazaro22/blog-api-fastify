import { app } from 'app';
import config from 'config';
import { FastifyReply, FastifyRequest } from 'fastify';
import User from 'models/user';
import { getAllUsersQuerySchema } from './validations/user-validation-schemas';

export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { limit: queryLimit, offset: queryOffset } =
    getAllUsersQuerySchema.parse(request.query);

  try {
    const limit = queryLimit || config.defaultResLimit;
    const offset = queryOffset || config.defaultResOffset;
    const total = await User.countDocuments();

    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    return reply.code(200).send({
      limit,
      offset,
      total,
      users,
    });
  } catch (err) {
    app.log.error(err, 'Error while getting all users.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
