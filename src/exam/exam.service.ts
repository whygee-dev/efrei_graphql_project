import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamInput, UpdateExamInput } from './exam.input';
import { partialize } from 'src/common/utils';

const EXAM_INCLUDES = {
  course: {
    include: {
      genericCourse: true,
    },
  },
};

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async getExamsByCourse(courseId: string) {
    return this.prisma.exam.findMany({
      where: { courseId, deleted: false },
      include: EXAM_INCLUDES,
    });
  }

  async getExam(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: EXAM_INCLUDES,
    });
  }

  async createExam(data: CreateExamInput) {
    const { courseId, ...rest } = data;

    return this.prisma.exam.create({
      data: {
        ...rest,
        course: { connect: { id: courseId } },
      },
      include: EXAM_INCLUDES,
    });
  }

  async updateExam(data: UpdateExamInput) {
    const { courseId, id, ...rest } = data;

    return this.prisma.exam.update({
      where: { id },
      data: {
        ...partialize(rest),
        course: courseId ? { connect: { id: courseId } } : undefined,
      },
      include: EXAM_INCLUDES,
    });
  }

  async deleteExam(id: string) {
    return this.prisma.exam.update({
      where: { id },
      data: { deleted: true },
      include: EXAM_INCLUDES,
    });
  }
}
