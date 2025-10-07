import { commentBlog } from 'controllers/v1/comment/comment-blog';
import { deleteComment } from 'controllers/v1/comment/delete-comment';
import { getCommentsByBlogId } from 'controllers/v1/comment/get-comments-by-blog-id';
import { FastifyInstance } from 'fastify';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

export async function commentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    commentBlog,
  );
  app.get(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    getCommentsByBlogId,
  );
  app.delete(
    '/:commentId',
    { onRequest: [authorize(['admin', 'user'])] },
    deleteComment,
  );
}
