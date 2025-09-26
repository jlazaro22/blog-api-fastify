import { FastifyInstance } from 'fastify';
import { register } from '../../controllers/v1/auth/register.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', register);
}
