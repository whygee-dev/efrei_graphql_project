import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurriculumInput } from './curriculum.input';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurriculums() {
    return this.prisma.curriculum.findMany({ where: { deleted: false } });
  }

  async getCurriculum(id: string) {
    return this.prisma.curriculum.findUnique({ where: { id } });
  }

  async createCurriculum(data: CreateCurriculumInput) {
    return this.prisma.curriculum.create({ data });
  }

  async updateCurriculum(data: any) {
    return this.prisma.curriculum.update({
      where: { id: data.id },
      data,
    });
  }

  async deleteCurriculum(id: string) {
    return this.prisma.curriculum.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
