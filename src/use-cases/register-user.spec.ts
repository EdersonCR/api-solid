import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { expect, test, describe, beforeEach } from 'vitest';
import { RegisterUserUseCase } from './register-user';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(usersRepository);
  });

  test('should hash user password upon registration', async () => {
    const password = '123456';

    const { user } = await sut.execute({
      name: 'Roger Waters',
      email: 'waters@pinkfloyd.com',
      password,
    });

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  test('should not be able to register with same email twice', async () => {
    const email = 'waters@pinkfloyd.com';

    await sut.execute({
      name: 'Roger Waters',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        name: 'David Gilmour',
        email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  test('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Roger Waters',
      email: 'waters@pinkfloyd.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
