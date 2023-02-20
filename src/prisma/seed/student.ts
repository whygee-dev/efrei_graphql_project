import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createAddress } from './address';

export const createStudent = async (
  prisma: PrismaClient,
  groupId: string,
  curriculumId: string,
) => {
  return prisma.student.create({
    data: {
      personalInfo: {
        create: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          birthDate: faker.date.past(),
          email: faker.internet.email(),
          address: {
            connect: {
              id: (await createAddress(prisma)).id,
            },
          },
        },
      },
      group: {
        connect: {
          id: groupId,
        },
      },
      curriculum: {
        connect: {
          id: curriculumId,
        },
      },
    },
    include: {
      personalInfo: { include: { address: true } },
      group: true,
      curriculum: true,
    },
  });
};
