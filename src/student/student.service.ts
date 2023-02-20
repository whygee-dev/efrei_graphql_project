import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentInput, UpdateStudentInput } from './student.input';
import { partialize } from '../common/utils';
import { Prisma } from '@prisma/client';

const INCLUDES: Prisma.StudentInclude = {
  personalInfo: {
    include: {
      address: true,
    },
  },
  curriculum: true,
  group: true,
};

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async createStudent(data: CreateStudentInput) {
    const { curriculumId, groupId, ...rest } = data;

    return this.prisma.student.create({
      data: {
        ...rest,
        curriculum: { connect: { id: curriculumId } },
        personalInfo: {
          create: {
            ...data.personalInfo,
            address: {
              create: {
                ...data.personalInfo.address,
              },
            },
          },
        },
        group: {
          connect: { id: groupId },
        },
      },
      include: INCLUDES,
    });
  }

  async getStudent(id: string) {
    return this.prisma.student.findUnique({ where: { id }, include: INCLUDES });
  }

  async getStudents() {
    return this.prisma.student.findMany({ include: INCLUDES });
  }

  async updateStudent(data: UpdateStudentInput) {
    const { id, personalInfo, curriculumId, groupId, ...rest } = data;

    return this.prisma.student.update({
      where: { id },
      data: {
        ...partialize(rest),
        personalInfo: {
          update: {
            ...partialize(personalInfo),
            address: personalInfo.address
              ? {
                  update: personalInfo.address,
                }
              : undefined,
          },
        },
        curriculum: curriculumId
          ? {
              connect: { id: curriculumId },
            }
          : undefined,
        group: groupId
          ? {
              connect: { id: groupId },
            }
          : undefined,
      },
      include: INCLUDES,
    });
  }

  async deleteStudent(id: string) {
    return this.prisma.student.update({
      where: { id },
      data: { deleted: true },
      include: INCLUDES,
    });
  }
}
