import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-serach-gyms-use-case';

export async function searchGyms(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = querySchema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({
    gyms,
  });
}
