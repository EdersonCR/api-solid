import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Floyd Academy',
        description: '',
        phone: '',
        latitude: -22.2199808,
        longitude: -45.4688768,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Pink Academy',
        description: '',
        phone: '',
        latitude: -22.2199808,
        longitude: -45.4688768,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Floyd',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body.gyms).toHaveLength(1);

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Floyd Academy',
      }),
    ]);
  });
});
