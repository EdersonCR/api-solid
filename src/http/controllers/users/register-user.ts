import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case';

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = bodySchema.parse(request.body);

  try {
    const registerUserUseCase = makeRegisterUserUseCase();

    await registerUserUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
