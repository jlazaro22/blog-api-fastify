import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from '../app';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    app.log.error(err, 'Error during authentication.');
    return reply.code(401).send({ message: 'Unauthorized.' });
  }
}
