import { CheckIn, Prisma } from 'generated/prisma';
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';
import moment from 'moment-timezone';

export class InMemoryCkeckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id);

    return checkIn || null;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = moment(checkIn.created_at);
      const newCheckInDate = moment(date);

      const isSameDay = checkInDate.isSame(newCheckInDate, 'day');

      return checkIn.user_id === userId && isSameDay;
    });

    return checkInOnSameDate || null;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
