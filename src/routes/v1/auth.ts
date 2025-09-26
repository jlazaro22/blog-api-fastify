import { FastifyInstance } from 'fastify';

import { login } from '../../controllers/v1/auth/login.js';
import { logout } from '../../controllers/v1/auth/logout.js';
import { refreshToken } from '../../controllers/v1/auth/refresh-token.js';
import { register } from '../../controllers/v1/auth/register.js';
import { authenticate } from '../../middlewares/authenticate.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/refresh-token', refreshToken);
  app.post('/logout', { onRequest: [authenticate] }, logout);
}
