import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export const createCourse = (
  prisma: PrismaClient,
  professorId: string,
  genericCourseId: string,
) => {
  return prisma.course.create({
    data: {
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      professor: {
        connect: { id: professorId },
      },
      genericCourse: {
        connect: { id: genericCourseId },
      },
    },
    include: {
      genericCourse: true,
      professor: {
        include: {
          personalInfo: {
            include: {
              address: true,
            },
          },
        },
      },
    },
  });
};
