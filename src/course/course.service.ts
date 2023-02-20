import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseInput, UpdateCourseInput } from './course.input';
import { Prisma } from '@prisma/client';

const COURSE_INCLUDES: Prisma.CourseInclude = {
  genericCourse: true,
  professor: {
    include: {
      personalInfo: {
        include: {
          address: true,
        },
      },
    },
  },
};

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(data: CreateCourseInput) {
    const { genericCourseId, professorId, ...rest } = data;

    return this.prisma.course.create({
      data: {
        ...rest,
        genericCourse: {
          connect: { id: genericCourseId },
        },
        professor: {
          connect: { id: professorId },
        },
      },
      include: COURSE_INCLUDES,
    });
  }

  async getCourse(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: COURSE_INCLUDES,
    });
  }

  async getCourses() {
    return this.prisma.course.findMany({
      include: COURSE_INCLUDES,
      where: { deleted: false },
    });
  }

  async updateCourse(data: UpdateCourseInput) {
    return this.prisma.course.update({
      where: { id: data.id },
      data,
      include: COURSE_INCLUDES,
    });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.update({
      where: { id },
      data: { deleted: true },
      include: COURSE_INCLUDES,
    });
  }
}
