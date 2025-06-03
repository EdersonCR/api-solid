import { CheckIn } from 'generated/prisma';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface FetchUserCheckInsHisotryUseCaseParam {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHisotryUseCaseReturn {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHisotryUseCase {
  private checkInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHisotryUseCaseParam): Promise<FetchUserCheckInsHisotryUseCaseReturn> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    return { checkIns };
  }
}
