import { CheckIn } from 'generated/prisma';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberofCheckInsError } from './errors/max-number-of-check-ins-error';

interface CheckInUseCaseParam {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseReturn {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  private checkInsRepository;
  private gymsRepository;

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInsRepository = checkInsRepository;
    this.gymsRepository = gymsRepository;
  }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseParam): Promise<CheckInUseCaseReturn> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new MaxNumberofCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
