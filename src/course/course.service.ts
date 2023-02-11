import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseInput, UpdateCourseInput } from './course.input';

export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(data: CreateCourseInput) {
    return this.prisma.course.create({ data });
  }

  async getCourse(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async getCourses() {
    return this.prisma.course.findMany();
  }

  async updateCourse(id: string, data: UpdateCourseInput) {
    return this.prisma.course.update({ where: { id }, data });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
