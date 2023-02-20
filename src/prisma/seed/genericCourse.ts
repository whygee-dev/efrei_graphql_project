import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createGenericCourse = (prisma: PrismaClient) => {
  return prisma.genericCourse.create({
    data: {
      name: faker.commerce.productName(),
    },
  });
};
