import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassInput, UpdateClassInput } from './class.input';
import { partialize } from 'src/common/utils';

const CLASS_INCLUDES: Prisma.ClassInclude = {
  classroom: true,
  professor: true,
  course: true,
};

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  async getClasses() {
    return this.prisma.class.findMany({
      where: { deleted: false },
      include: CLASS_INCLUDES,
    });
  }

  async getClass(id: string) {
    return this.prisma.class.findUnique({
      where: { id },
      include: CLASS_INCLUDES,
    });
  }

  async createClass(data: CreateClassInput) {
    const { courseId, professorId, classroomId, ...rest } = data;

    return this.prisma.class.create({
      data: {
        ...rest,
        classroom: {
          connect: { id: classroomId },
        },
        professor: {
          connect: { id: professorId },
        },
        course: {
          connect: { id: courseId },
        },
      },
      include: CLASS_INCLUDES,
    });
  }

  async updateClass(data: UpdateClassInput) {
    const { courseId, professorId, classroomId, id, ...rest } = data;

    return this.prisma.class.update({
      where: { id },
      data: {
        ...partialize(rest),
        classroom: data.classroomId
          ? { connect: { id: classroomId } }
          : undefined,
        professor: data.professorId
          ? { connect: { id: professorId } }
          : undefined,
        course: data.courseId ? { connect: { id: courseId } } : undefined,
      },
      include: CLASS_INCLUDES,
    });
  }

  async deleteClass(id: string) {
    return this.prisma.class.update({
      where: { id },
      data: { deleted: true },
      include: CLASS_INCLUDES,
    });
  }
}
