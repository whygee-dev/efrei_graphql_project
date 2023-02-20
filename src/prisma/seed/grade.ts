import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createGrade = (
  prisma: PrismaClient,
  examId: string,
  studentId: string,
) => {
  return prisma.grade.create({
    data: {
      grade: faker.datatype.number(10),
      exam: {
        connect: { id: examId },
      },
      student: {
        connect: { id: studentId },
      },
    },
  });
};
