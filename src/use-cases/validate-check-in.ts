import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from 'generated/prisma';
import moment from 'moment-timezone';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

interface ValidateCheckInUseCaseParam {
  checkInId: string;
}

interface ValidateCheckInUseCaseReturn {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  private checkInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseParam): Promise<ValidateCheckInUseCaseReturn> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const now = moment(new Date());
    const createdAt = moment(checkIn.created_at);

    const distanceInMinutesFromCheckInCreation = now.diff(createdAt, 'minutes');

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
