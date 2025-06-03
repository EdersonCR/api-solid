import { expect, test, describe, beforeEach } from 'vitest';
import { InMemoryCkeckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCkeckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCkeckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  test('should be able to get check-ins count metrics', async () => {
    for (let i = 1; i <= 3; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(3);
  });
});
