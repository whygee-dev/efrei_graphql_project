import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampusInput, UpdateCampusInput } from './campus.input';

const CAMPUS_INCLUDE = {
  buildings: true,
  address: true,
};

@Injectable()
export class CampusService {
  constructor(private readonly prisma: PrismaService) {}

  async getCampuses() {
    return this.prisma.campus.findMany({
      where: { deleted: false },
      include: CAMPUS_INCLUDE,
    });
  }

  async getCampus(id: string) {
    return this.prisma.campus.findUnique({
      where: { id },
      include: CAMPUS_INCLUDE,
    });
  }

  async createCampus(data: CreateCampusInput) {
    const { name, address } = data;

    return this.prisma.campus.create({
      data: {
        name,
        address: {
          create: address,
        },
      },
      include: CAMPUS_INCLUDE,
    });
  }

  async updateCampus(data: UpdateCampusInput) {
    const { id, name, address } = data;

    return this.prisma.campus.update({
      where: { id },
      data: {
        name,
        address: address
          ? {
              update: address,
            }
          : undefined,
      },
      include: CAMPUS_INCLUDE,
    });
  }

  async deleteCampus(id: string) {
    return this.prisma.campus.update({
      where: { id },
      data: {
        deleted: true,
      },
      include: CAMPUS_INCLUDE,
    });
  }
}
