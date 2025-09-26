import { FastifyInstance } from 'fastify';
import { getCurrentUser } from '../../controllers/v1/user/get-current-user.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';

export async function userRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.get(
    '/current',
    { onRequest: [authorize(['admin', 'user'])] },
    getCurrentUser,
  );
}
