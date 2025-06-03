import { expect, test, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  test('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Pink Academy',
      description: null,
      phone: null,
      latitude: -22.2199808,
      longitude: -45.4688768,
    });

    await gymsRepository.create({
      title: 'Floyd Academy',
      description: null,
      phone: null,
      latitude: -22.2299808,
      longitude: -45.4788768,
    });

    const { gyms } = await sut.execute({
      query: 'Floyd',
      page: 1,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([expect.objectContaining({ title: 'Floyd Academy' })]);
  });

  test('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academy ${i}`,
        description: null,
        phone: null,
        latitude: -22.2199808 + i,
        longitude: -45.4688768 + i,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Academy',
      page: 2,
    });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academy 21' }),
      expect.objectContaining({ title: 'Academy 22' }),
    ]);
  });
});
