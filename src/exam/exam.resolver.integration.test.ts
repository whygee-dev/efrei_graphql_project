import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import 'jest-extended';
import { createExam } from 'src/prisma/seed/exam';
import { Course, Exam, GenericCourse, Professor } from '@prisma/client';
import { createCourse } from 'src/prisma/seed/course';
import { createProfessor } from 'src/prisma/seed/professor';
import { createGenericCourse } from 'src/prisma/seed/genericCourse';

describe('ExamResolver', () => {
  const manager = new IntegrationTestManager();

  let exams = <(Exam & { course: Course })[]>[];
  let course: Course & { genericCourse: GenericCourse };
  let course2: Course & { genericCourse: GenericCourse };
  let professor: Professor;
  let genericCourse: GenericCourse;

  const populate = async (count = 10) => {
    exams = [];

    professor = await createProfessor(manager.prisma);
    genericCourse = await createGenericCourse(manager.prisma);

    course = await createCourse(manager.prisma, professor.id, genericCourse.id);
    course2 = await createCourse(
      manager.prisma,
      professor.id,
      genericCourse.id,
    );

    for (let i = 0; i < count; i++) {
      exams.push(
        await createExam(
          manager.prisma,
          Math.random() > 0.5 ? course.id : course2.id,
        ),
      );
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createExam', () => {
    const mutation = gql`
      mutation CreateExam($data: CreateExamInput!) {
        createExam(data: $data) {
          id
          name
          startDate
          endDate
          course {
            id
            genericCourse {
              id
              name
            }
          }
        }
      }
    `;

    it('should create a exam', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Exam',
          courseId: course.id,
          startDate: new Date(),
          endDate: new Date(),
        },
      };

      // Act
      const result = await manager.sendQuery<{ createExam: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createExam).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
        startDate: variables.data.startDate.toISOString(),
        endDate: variables.data.endDate.toISOString(),
        course: {
          id: course.id,
          genericCourse: {
            id: course.genericCourse.id,
            name: course.genericCourse.name,
          },
        },
      });
    });
  });

  describe('updateExam', () => {
    const mutation = gql`
      mutation UpdateExam($data: UpdateExamInput!) {
        updateExam(data: $data) {
          id
          name
          startDate
          endDate
          course {
            id
            genericCourse {
              id
              name
            }
          }
        }
      }
    `;

    it('should update a exam', async () => {
      // Arrange
      await populate();

      const exam = await createExam(manager.prisma, course.id);

      const variables = {
        data: {
          id: exam.id,
          name: 'Updated Exam',
          courseId: course2.id,
          startDate: new Date(),
          endDate: new Date(),
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateExam: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateExam).toMatchObject({
        id: exam.id,
        name: variables.data.name,
        startDate: variables.data.startDate.toISOString(),
        endDate: variables.data.endDate.toISOString(),
        course: {
          id: course2.id,
          genericCourse: {
            id: course2.genericCourse.id,
            name: course2.genericCourse.name,
          },
        },
      });
    });
  });

  describe('deleteExam', () => {
    const mutation = gql`
      mutation DeleteExam($id: String!) {
        deleteExam(id: $id) {
          id
          name
          startDate
          endDate
          course {
            id
            genericCourse {
              id
              name
            }
          }
        }
      }
    `;

    it('should delete a exam', async () => {
      // Arrange
      await populate();

      const exam = await createExam(manager.prisma, course.id);

      const variables = {
        id: exam.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteExam: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteExam).toMatchObject({
        id: exam.id,
        name: exam.name,
        startDate: exam.startDate.toISOString(),
        endDate: exam.endDate.toISOString(),
        course: {
          id: course.id,
          genericCourse: {
            id: course.genericCourse.id,
            name: course.genericCourse.name,
          },
        },
      });

      const deletedExam = await manager.prisma.exam.findUnique({
        where: { id: exam.id },
      });

      expect(deletedExam).not.toBeNull();
      expect(deletedExam?.deleted).toBeTrue();
    });
  });

  describe('getExam', () => {
    const query = gql`
      query GetExam($id: String!) {
        getExam(id: $id) {
          id
          name
          startDate
          endDate
          course {
            id
            genericCourse {
              id
              name
            }
          }
        }
      }
    `;

    it('should get a exam', async () => {
      // Arrange
      await populate();

      const exam = exams[0];

      const variables = {
        id: exam.id,
      };

      // Act
      const result = await manager.sendQuery<{ getExam: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getExam).toMatchObject({
        id: exam.id,
        name: exam.name,
        startDate: exam.startDate.toISOString(),
        endDate: exam.endDate.toISOString(),
        course: {
          id: exam.course.id,
          genericCourse: {
            id: course.genericCourse.id,
            name: course.genericCourse.name,
          },
        },
      });
    });
  });

  describe('getExamsByCourse', () => {
    const query = gql`
      query GetExamsByCourse($courseId: String!) {
        getExamsByCourse(courseId: $courseId) {
          id
          name
          startDate
          endDate
          course {
            id
            genericCourse {
              id
              name
            }
          }
        }
      }
    `;

    it('should get exams', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const variables = {
        courseId: course.id,
      };

      const result = await manager.sendQuery<{ getExamsByCourse: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getExamsByCourse).toEqual(
        exams
          .filter((exam) => exam.courseId === course.id)
          .map((exam) => ({
            id: exam.id,
            name: exam.name,
            startDate: exam.startDate.toISOString(),
            endDate: exam.endDate.toISOString(),
            course: {
              id: course.id,
              genericCourse: {
                id: course.genericCourse.id,
                name: course.genericCourse.name,
              },
            },
          })),
      );
    });
  });
});
