import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupInput, UpdateGroupInput } from './group.input';
import { Prisma } from '@prisma/client';

const GROUP_INCLUDE: Prisma.GroupInclude = {
  curriculum: true,
};

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroups() {
    return this.prisma.group.findMany({
      where: { deleted: false },
      include: GROUP_INCLUDE,
    });
  }

  async getGroup(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      include: GROUP_INCLUDE,
    });
  }

  async createGroup(data: CreateGroupInput) {
    const { name, curriculumId } = data;

    return this.prisma.group.create({
      data: {
        name,
        curriculum: {
          connect: { id: curriculumId },
        },
      },
      include: GROUP_INCLUDE,
    });
  }

  async updateGroup(data: UpdateGroupInput) {
    const { id, name, curriculumId } = data;

    return this.prisma.group.update({
      where: { id },
      data: {
        name,
        curriculum: curriculumId
          ? { connect: { id: curriculumId } }
          : undefined,
      },
      include: GROUP_INCLUDE,
    });
  }

  async deleteGroup(id: string) {
    return this.prisma.group.update({
      where: { id },
      data: { deleted: true },
      include: GROUP_INCLUDE,
    });
  }
}
