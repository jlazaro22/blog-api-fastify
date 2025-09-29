import { FastifyReply, FastifyRequest } from 'fastify';

import { IUser } from 'models/user';

export function authorize(roles: IUser['role'][]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (!roles.includes(role)) {
      return reply.code(403).send({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }
  };
}
