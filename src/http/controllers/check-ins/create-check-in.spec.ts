import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Floyd Academy',
        latitude: -22.2199808,
        longitude: -45.4688768,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.2199808,
        longitude: -45.4688768,
      });

    expect(response.statusCode).toEqual(201);
  });
});
