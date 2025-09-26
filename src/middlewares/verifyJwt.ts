import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from '../app.js';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    app.log.error(err, 'Error during authentication.');
    return reply.status(401).send({ message: 'Unauthorized.' });
  }
}
