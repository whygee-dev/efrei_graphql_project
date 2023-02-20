import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateGenericCourseInput,
  UpdateGenericCourseInput,
} from './generic-course.input';

@Injectable()
export class GenericCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async createGenericCourse(data: CreateGenericCourseInput) {
    return this.prisma.genericCourse.create({ data });
  }

  async updateGenericCourse(data: UpdateGenericCourseInput) {
    return this.prisma.genericCourse.update({
      where: { id: data.id },
      data,
    });
  }

  async deleteGenericCourse(id: string) {
    return this.prisma.genericCourse.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async getGenericCourse(id: string) {
    return this.prisma.genericCourse.findUnique({
      where: { id },
    });
  }

  async getGenericCourses() {
    return this.prisma.genericCourse.findMany({ where: { deleted: false } });
  }
}
