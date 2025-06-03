import { expect, test, describe, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  test('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Floyd Academy',
      description: null,
      phone: null,
      latitude: -22.2199808,
      longitude: -45.4688768,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
