import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { searchGyms } from './search-gyms';
import { nearbyGyms } from './nearby-gyms';
import { createGym } from './create-gym';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.get('/gyms/search', searchGyms);
  app.get('/gyms/nearby', nearbyGyms);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym);
}
