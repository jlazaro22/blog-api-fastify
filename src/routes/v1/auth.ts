import { FastifyInstance } from 'fastify';

import { login } from '../../controllers/v1/auth/login.js';
import { refreshToken } from '../../controllers/v1/auth/refresh-token.js';
import { register } from '../../controllers/v1/auth/register.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/refresh-token', refreshToken);
}
