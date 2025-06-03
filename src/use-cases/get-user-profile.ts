import { UsersRepository } from '@/repositories/users-repository';
import { User } from 'generated/prisma';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseParam {
  userId: string;
}

interface GetUserProfileUseCaseReturn {
  user: User;
}

export class GetUserProfileUseCase {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    userId,
  }: GetUserProfileUseCaseParam): Promise<GetUserProfileUseCaseReturn> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
