import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentInput, UpdateStudentInput } from './student.input';
import { partialize } from 'src/common/utils';
import { Prisma } from '@prisma/client';

const INCLUDES: Prisma.StudentInclude = {
  address: true,
  curriculum: true,
};

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async createStudent(data: CreateStudentInput) {
    const { curriculumId, ...rest } = data;

    return this.prisma.student.create({
      data: {
        ...rest,
        curriculum: { connect: { id: curriculumId } },
        address: {
          create: {
            ...data.address,
          },
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
    const { id, address, ...rest } = data;

    return this.prisma.student.update({
      where: { id },
      data: {
        ...partialize(rest),
        address: address
          ? {
              update: {
                ...address,
              },
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
