import { Gym } from 'generated/prisma';
import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseParam {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseReturn {
  gym: Gym;
}

export class CreateGymUseCase {
  private gymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseParam): Promise<CreateGymUseCaseReturn> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
