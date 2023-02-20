import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createAddress = (prisma: PrismaClient) => {
  return prisma.address.create({
    data: {
      street: faker.address.street(),
      city: faker.address.city(),
      zipCode: faker.address.zipCode(),
      country: faker.address.country(),
    },
  });
};
