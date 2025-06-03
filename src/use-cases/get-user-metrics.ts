import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface GetUserMetricsUseCaseParam {
  userId: string;
}

interface GetUserMetricsUseCaseReturn {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  private checkInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async execute({
    userId,
  }: GetUserMetricsUseCaseParam): Promise<GetUserMetricsUseCaseReturn> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return { checkInsCount };
  }
}
