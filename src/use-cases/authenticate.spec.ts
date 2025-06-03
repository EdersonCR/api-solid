import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { expect, test, describe, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  test('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Roger Waters',
      email: 'waters@pinkfloyd.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'waters@pinkfloyd.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  test('should not be able to authenticate whith wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'waters@pinkfloyd.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test('should not be able to authenticate whith wrong password', async () => {
    await usersRepository.create({
      name: 'Roger Waters',
      email: 'waters@pinkfloyd.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'waters@pinkfloyd.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
