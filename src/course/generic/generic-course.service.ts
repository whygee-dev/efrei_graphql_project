import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenericCourse } from './generic-course.input';

@Injectable()
export class GenericCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(data: CreateGenericCourse) {
    return this.prisma.genericCourse.create({ data });
  }

  async getGenericCourses() {
    return this.prisma.genericCourse.findMany();
  }
}
