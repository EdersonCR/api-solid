import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Authenticate', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'David Gilmour',
      email: 'gilmour@pinkfloyd.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'gilmour@pinkfloyd.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
