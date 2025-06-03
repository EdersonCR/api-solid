import { expect, test, describe, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from './check-in';
import { InMemoryCkeckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberofCheckInsError } from './errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let checkInsRepository: InMemoryCkeckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Get User Profile', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCkeckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      description: null,
      phone: null,
      latitude: -22.2199808,
      longitude: -45.4688768,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.2199808,
      userLongitude: -45.4688768,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 5, 2, 20, 15, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.2199808,
      userLongitude: -45.4688768,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.2199808,
        userLongitude: -45.4688768,
      }),
    ).rejects.toBeInstanceOf(MaxNumberofCheckInsError);
  });

  test('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2025, 5, 2, 20, 15, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.2199808,
      userLongitude: -45.4688768,
    });

    vi.setSystemTime(new Date(2025, 5, 3, 20, 15, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.2199808,
      userLongitude: -45.4688768,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'Academia 02',
      description: '',
      phone: '',
      latitude: -22.245935,
      longitude: -45.4698862,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.2199808,
        userLongitude: -45.4688768,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  test('should not be able to check in on wrong gym', async () => {
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.2199808,
        userLongitude: -45.4688768,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
