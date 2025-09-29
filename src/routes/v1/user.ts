import { FastifyInstance } from 'fastify';

import { getCurrentUser } from 'controllers/v1/user/get-current-user';
import { updateCurrentUser } from 'controllers/v1/user/update-current-user';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

export async function userRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.get(
    '/current',
    { onRequest: [authorize(['admin', 'user'])] },
    getCurrentUser,
  );

  app.put(
    '/current',
    { onRequest: [authorize(['admin', 'user'])] },
    updateCurrentUser,
  );
}
