import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Academy',
        description: '',
        phone: '',
        latitude: -22.2464843,
        longitude: -45.4671746,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Academy',
        description: '',
        phone: '',
        latitude: -22.4268842,
        longitude: -45.4584866,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.2497653,
        longitude: -45.4744962,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body.gyms).toHaveLength(1);

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Academy',
      }),
    ]);
  });
});
