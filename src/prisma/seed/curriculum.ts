import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createCurriculum = (prisma: PrismaClient) => {
  return prisma.curriculum.create({
    data: {
      name: faker.word.verb(),
    },
  });
};
