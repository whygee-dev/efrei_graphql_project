import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createGroup = (prisma: PrismaClient, curriculumId: string) => {
  return prisma.group.create({
    data: {
      name: faker.word.verb(),
      curriculum: {
        connect: {
          id: curriculumId,
        },
      },
    },
  });
};
