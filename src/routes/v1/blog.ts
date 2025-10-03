import { createBlog } from 'controllers/v1/blog/create-blog';
import { FastifyInstance } from 'fastify';

import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

export async function blogRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/', { onRequest: [authorize(['admin'])] }, createBlog);
}
