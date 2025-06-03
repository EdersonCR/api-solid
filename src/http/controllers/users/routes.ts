import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { registerUser } from './register-user';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { refreshToken } from './refresh-token';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refreshToken);

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
