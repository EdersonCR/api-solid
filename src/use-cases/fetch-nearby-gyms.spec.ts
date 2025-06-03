import { expect, test, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  test('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Academy',
      description: null,
      phone: null,
      latitude: -22.2464843,
      longitude: -45.4671746,
    });

    await gymsRepository.create({
      title: 'Far Academy',
      description: null,
      phone: null,
      latitude: -22.4268842,
      longitude: -45.4584866,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.2497653,
      userLongitude: -45.4744962,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Academy' })]);
  });
});
