import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { authRoutes } from './auth';
import { userRoutes } from './user';
import { blogRoutes } from './blog';

export async function v1Routes(app: FastifyInstance) {
  app.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({
      message: '🚀 API is live.',
      status: 'ok',
      version: '1.0.0',
      docs: 'https://docs.blog-api.tutorial.com',
      timestamp: new Date().toISOString(),
    });
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
  app.register(blogRoutes, { prefix: '/blogs' });
}
