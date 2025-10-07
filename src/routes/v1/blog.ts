import { FastifyInstance } from 'fastify';

import { createBlog } from 'controllers/v1/blog/create-blog';
import { getAllBlogs } from 'controllers/v1/blog/get-all-blogs';
import { getBlogBySlug } from 'controllers/v1/blog/get-blog-by-slug';
import { getBlogsByUserId } from 'controllers/v1/blog/get-blogs-by-user-id';
import { updateBlog } from 'controllers/v1/blog/update-blog';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

export async function blogRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/', { onRequest: [authorize(['admin'])] }, createBlog);
  app.get('/', { onRequest: [authorize(['admin', 'user'])] }, getAllBlogs);
  app.get(
    '/user/:userId',
    { onRequest: [authorize(['admin', 'user'])] },
    getBlogsByUserId,
  );
  app.get(
    '/:slug',
    { onRequest: [authorize(['admin', 'user'])] },
    getBlogBySlug,
  );
  app.put('/:blogId', { onRequest: [authorize(['admin'])] }, updateBlog);
}
