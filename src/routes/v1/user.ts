import { FastifyInstance } from 'fastify';

import { deleteCurrentUser } from 'controllers/v1/user/delete-current-user';
import { deleteUserById } from 'controllers/v1/user/delete-user-by-id';
import { getAllUsers } from 'controllers/v1/user/get-all-users';
import { getCurrentUser } from 'controllers/v1/user/get-current-user';
import { getUserById } from 'controllers/v1/user/get-user-by-id';
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
  app.delete(
    '/current',
    { onRequest: [authorize(['admin', 'user'])] },
    deleteCurrentUser,
  );
  app.get('/', { onRequest: [authorize(['admin'])] }, getAllUsers);
  app.get('/:userId', { onRequest: [authorize(['admin'])] }, getUserById);
  app.delete('/:userId', { onRequest: [authorize(['admin'])] }, deleteUserById);
}
