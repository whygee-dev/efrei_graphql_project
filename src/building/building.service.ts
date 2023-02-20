import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBuildingInput, UpdateBuildingInput } from './building.input';

const BUILDING_INCLUDE = {
  campus: true,
};

@Injectable()
export class BuildingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBuildings() {
    return this.prisma.building.findMany({
      where: { deleted: false },
      include: BUILDING_INCLUDE,
    });
  }

  async getBuilding(id: string) {
    return this.prisma.building.findUnique({
      where: { id },
      include: BUILDING_INCLUDE,
    });
  }

  async createBuilding(data: CreateBuildingInput) {
    const { campusId, ...rest } = data;

    return this.prisma.building.create({
      data: {
        ...rest,
        campus: {
          connect: { id: campusId },
        },
      },
      include: BUILDING_INCLUDE,
    });
  }

  async updateBuilding(data: UpdateBuildingInput) {
    const { id, name, campusId } = data;

    return this.prisma.building.update({
      where: { id },
      data: {
        name,
        campus: campusId
          ? {
              connect: { id: campusId },
            }
          : undefined,
      },
      include: BUILDING_INCLUDE,
    });
  }

  async deleteBuilding(id: string) {
    return this.prisma.building.update({
      where: { id },
      data: {
        deleted: true,
      },
      include: BUILDING_INCLUDE,
    });
  }
}
