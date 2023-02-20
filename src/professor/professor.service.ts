import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessorInput, UpdateProfessorInput } from './professor.input';
import { partialize } from '../common/utils';
import { Prisma } from '@prisma/client';

const PROFESSOR_INCLUDES: Prisma.ProfessorInclude = {
  personalInfo: {
    include: {
      address: true,
    },
  },
};

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfessor(data: CreateProfessorInput) {
    return this.prisma.professor.create({
      data: {
        ...data,
        personalInfo: {
          create: {
            ...data.personalInfo,
            address: {
              create: data.personalInfo.address,
            },
          },
        },
      },
      include: PROFESSOR_INCLUDES,
    });
  }

  async getProfessor(id: string) {
    return this.prisma.professor.findUnique({
      where: { id },
      include: PROFESSOR_INCLUDES,
    });
  }

  async getProfessors() {
    return this.prisma.professor.findMany({
      include: PROFESSOR_INCLUDES,
      where: { deleted: false },
    });
  }

  async updateProfessor(data: UpdateProfessorInput) {
    const { id, personalInfo, ...rest } = data;

    return this.prisma.professor.update({
      where: { id },
      data: {
        ...partialize(rest),
        personalInfo: {
          update: {
            ...partialize(personalInfo),
            address: personalInfo.address
              ? { update: partialize(personalInfo.address) }
              : undefined,
          },
        },
      },
      include: PROFESSOR_INCLUDES,
    });
  }

  async deleteProfessor(id: string) {
    return this.prisma.professor.update({
      where: { id },
      data: { deleted: true },
      include: PROFESSOR_INCLUDES,
    });
  }
}
