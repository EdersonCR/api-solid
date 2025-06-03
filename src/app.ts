import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { ZodError } from 'zod';
import { env } from './env';
import { checkInsRoutes } from './http/controllers/check-ins/routes';
import { ResourceNotFoundError } from './use-cases/errors/resource-not-found-error';
import { LateCheckInValidationError } from './use-cases/errors/late-check-in-validation-error';
import { MaxDistanceError } from './use-cases/errors/max-distance-error';
import { MaxNumberofCheckInsError } from './use-cases/errors/max-number-of-check-ins-error';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: 'Resource not found.' });
  }

  if (
    error instanceof LateCheckInValidationError ||
    error instanceof MaxDistanceError ||
    error instanceof MaxNumberofCheckInsError
  ) {
    return reply.status(400).send({ message: error.message });
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error);
  } else {
    // Here log external tool
  }

  return reply.status(500).send({ message: 'Iternal server error.' });
});
