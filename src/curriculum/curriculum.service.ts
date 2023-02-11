import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurriculums() {
    return this.prisma.curriculum.findMany();
  }
}
