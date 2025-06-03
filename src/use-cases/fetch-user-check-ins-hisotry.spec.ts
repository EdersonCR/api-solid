import { expect, test, describe, beforeEach } from 'vitest';
import { InMemoryCkeckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHisotryUseCase } from './fetch-user-check-ins-hisotry';

let checkInsRepository: InMemoryCkeckInsRepository;
let sut: FetchUserCheckInsHisotryUseCase;

describe('Get User Profile', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCkeckInsRepository();
    sut = new FetchUserCheckInsHisotryUseCase(checkInsRepository);
  });

  test('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ]);
  });

  test('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});
