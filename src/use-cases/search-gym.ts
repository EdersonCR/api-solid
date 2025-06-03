import { Gym } from 'generated/prisma';
import { GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsUseCaseParam {
  query: string;
  page: number;
}

interface SearchGymsUseCaseReturn {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  private gymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    query,
    page,
  }: SearchGymsUseCaseParam): Promise<SearchGymsUseCaseReturn> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
