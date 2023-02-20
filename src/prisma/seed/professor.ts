import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const createProfessor = (prisma: PrismaClient) => {
  return prisma.professor.create({
    data: {
      personalInfo: {
        create: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          address: {
            create: {
              street: faker.address.streetAddress(),
              city: faker.address.cityName(),
              zipCode: faker.address.zipCode(),
              country: faker.address.country(),
            },
          },
          birthDate: faker.date.past(),
        },
      },
      hourlyWage: faker.datatype.number(),
    },
    include: {
      personalInfo: {
        include: {
          address: true,
        },
      },
    },
  });
};
