import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createExam = (prisma: PrismaClient, courseId: string) => {
  return prisma.exam.create({
    data: {
      name: faker.word.adjective(),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      course: {
        connect: { id: courseId },
      },
    },
    include: {
      course: true,
    },
  });
};
