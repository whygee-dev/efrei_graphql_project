import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomInput, UpdateClassroomInput } from './classroom.input';
import { Prisma } from '@prisma/client';

const CLASSROOM_INCLUDE: Prisma.ClassroomInclude = {
  campus: true,
  building: true,
};

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  async getClassrooms() {
    return this.prisma.classroom.findMany({
      where: { deleted: false },
      include: CLASSROOM_INCLUDE,
    });
  }

  async getClassroom(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: CLASSROOM_INCLUDE,
    });
  }

  async createClassroom(data: CreateClassroomInput) {
    const { buildingId, campusId, ...rest } = data;

    return this.prisma.classroom.create({
      data: {
        ...rest,
        building: {
          connect: { id: buildingId },
        },
        campus: {
          connect: { id: campusId },
        },
      },
      include: CLASSROOM_INCLUDE,
    });
  }

  async updateClassroom(data: UpdateClassroomInput) {
    const { id, name, floor, buildingId, campusId } = data;

    return this.prisma.classroom.update({
      where: { id },
      data: {
        name,
        floor,
        building: buildingId
          ? {
              connect: { id: buildingId },
            }
          : undefined,
        campus: campusId
          ? {
              connect: { id: campusId },
            }
          : undefined,
      },
      include: CLASSROOM_INCLUDE,
    });
  }

  async deleteClassroom(id: string) {
    return this.prisma.classroom.update({
      where: { id },
      data: { deleted: true },
      include: CLASSROOM_INCLUDE,
    });
  }
}
