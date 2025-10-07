import { likeBlog } from 'controllers/v1/like/like-blog';
import { unlikeBlog } from 'controllers/v1/like/unlike-blog';
import { FastifyInstance } from 'fastify';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

export async function likeRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    likeBlog,
  );
  app.delete(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    unlikeBlog,
  );
}
