import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);

  return authenticateUseCase;
}
