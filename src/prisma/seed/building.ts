import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createBuilding = (prisma: PrismaClient, campusId: string) => {
  return prisma.building.create({
    data: {
      name: faker.company.name(),
      campus: {
        connect: {
          id: campusId,
        },
      },
    },
    include: {
      campus: true,
    },
  });
};
