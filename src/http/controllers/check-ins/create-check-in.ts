import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const paramsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { latitude, longitude } = bodySchema.parse(request.body);

  const { gymId } = paramsSchema.parse(request.params);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
