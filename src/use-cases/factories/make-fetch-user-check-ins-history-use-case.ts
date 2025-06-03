import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { FetchUserCheckInsHisotryUseCase } from '../fetch-user-check-ins-hisotry';

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHisotryUseCase(checkInsRepository);

  return useCase;
}
