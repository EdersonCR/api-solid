import { UsersRepository } from '@/repositories/users-repository';
import { User } from 'generated/prisma';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';

interface AuthenticateUseCaseParam {
  email: string;
  password: string;
}

interface AuthenticateUseCaseReturn {
  user: User;
}

export class AuthenticateUseCase {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseParam): Promise<AuthenticateUseCaseReturn> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
