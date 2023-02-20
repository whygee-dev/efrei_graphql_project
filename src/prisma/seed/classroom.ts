import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createClassroom = (
  prisma: PrismaClient,
  campusId: string,
  buildingId: string,
) => {
  return prisma.classroom.create({
    data: {
      name: faker.word.noun(),
      floor: faker.datatype.number(10),
      campus: {
        connect: {
          id: campusId,
        },
      },
      building: {
        connect: {
          id: buildingId,
        },
      },
    },
    include: {
      building: true,
      campus: true,
    },
  });
};
