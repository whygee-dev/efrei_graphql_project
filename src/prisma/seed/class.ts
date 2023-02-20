import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createClass = (
  prisma: PrismaClient,
  courseId: string,
  professorId: string,
  classroomId: string,
) => {
  return prisma.class.create({
    data: {
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      course: {
        connect: {
          id: courseId,
        },
      },
      professor: {
        connect: {
          id: professorId,
        },
      },
      classroom: {
        connect: {
          id: classroomId,
        },
      },
    },
    include: {
      course: true,
      professor: true,
      classroom: true,
    },
  });
};
