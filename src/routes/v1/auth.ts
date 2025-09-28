import { FastifyInstance } from 'fastify';

import { login } from '../../controllers/v1/auth/login';
import { logout } from '../../controllers/v1/auth/logout';
import { refreshToken } from '../../controllers/v1/auth/refresh-token';
import { register } from '../../controllers/v1/auth/register';
import { authenticate } from '../../middlewares/authenticate';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/refresh-token', refreshToken);
  app.post('/logout', { onRequest: [authenticate] }, logout);
}
