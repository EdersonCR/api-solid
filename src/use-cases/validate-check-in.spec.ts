import { expect, test, describe, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCkeckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCkeckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Get User Profile', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCkeckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));

    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  test('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  test('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 5, 3, 10, 25));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
