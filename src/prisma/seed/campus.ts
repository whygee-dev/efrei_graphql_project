import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createAddress } from './address';

export const createCampus = async (prisma: PrismaClient) => {
  return prisma.campus.create({
    data: {
      name: faker.word.noun(),
      address: {
        connect: {
          id: (await createAddress(prisma)).id,
        },
      },
    },
    include: {
      address: true,
      buildings: true,
    },
  });
};
