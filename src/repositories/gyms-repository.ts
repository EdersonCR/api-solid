/* eslint-disable no-unused-vars */
import { Prisma, Gym } from 'generated/prisma';

export interface GeocodeParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(params: GeocodeParams): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
