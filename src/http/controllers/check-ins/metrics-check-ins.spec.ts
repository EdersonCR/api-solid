import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check-in Metrics', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able to get the total count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Floyd Academy',
        latitude: -22.2199808,
        longitude: -45.4688768,
      },
    });

    const user = await prisma.user.findFirstOrThrow();

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body.checkInsCount).toBe(2);
  });
});
