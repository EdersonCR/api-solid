import { Gym } from 'generated/prisma';
import { GymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseParam {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseReturn {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  private gymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseParam): Promise<FetchNearbyGymsUseCaseReturn> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
