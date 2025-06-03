import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { createCheckIn } from './create-check-in';
import { validateCheckIn } from './validate-check-in';
import { historyCheckIns } from './history-check-ins';
import { metricsCheckIns } from './metrics-check-ins';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.get('/check-ins/history', historyCheckIns);
  app.get('/check-ins/metrics', metricsCheckIns);

  app.post('/gyms/:gymId/check-ins', createCheckIn);
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateCheckIn,
  );
}
