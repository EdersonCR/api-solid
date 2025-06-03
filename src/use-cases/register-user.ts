import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from 'generated/prisma';

interface RegisterUserUseCaseParam {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserUseCaseReturn {
  user: User;
}

export class RegisterUserUseCase {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseParam): Promise<RegisterUserUseCaseReturn> {
    const passwordHash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return { user };
  }
}
