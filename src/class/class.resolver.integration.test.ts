import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import {
  Classroom,
  Class,
  Professor,
  GenericCourse,
  Course,
  Building,
  Campus,
} from '@prisma/client';
import 'jest-extended';
import { createProfessor } from 'src/prisma/seed/professor';
import { createClass } from 'src/prisma/seed/class';
import { createGenericCourse } from 'src/prisma/seed/genericCourse';
import { createCourse } from 'src/prisma/seed/course';
import { createClassroom } from 'src/prisma/seed/classroom';
import { createBuilding } from 'src/prisma/seed/building';
import { createCampus } from 'src/prisma/seed/campus';

describe('ClassResolver', () => {
  const manager = new IntegrationTestManager();

  let course: Course, course2: Course;
  let classroom: Classroom;
  let classroom2: Classroom;
  let building: Building;
  let campus: Campus;
  let professor: Professor, genericCourse: GenericCourse;
  let professor2: Professor;
  let classes = <
    (Class & {
      professor: Professor;
      course: Course;
      classroom: Classroom;
    })[]
  >[];

  const populate = async (count = 10) => {
    classes = [];
    professor = await createProfessor(manager.prisma);
    professor2 = await createProfessor(manager.prisma);
    genericCourse = await createGenericCourse(manager.prisma);
    course = await createCourse(manager.prisma, professor.id, genericCourse.id);
    course2 = await createCourse(
      manager.prisma,
      professor2.id,
      genericCourse.id,
    );
    campus = await createCampus(manager.prisma);
    building = await createBuilding(manager.prisma, campus.id);
    classroom = await createClassroom(manager.prisma, campus.id, building.id);
    classroom2 = await createClassroom(manager.prisma, campus.id, building.id);

    for (let i = 0; i < count; i++) {
      classes.push(
        await createClass(
          manager.prisma,
          Math.random() > 0.5 ? course.id : course2.id,
          Math.random() > 0.5 ? professor.id : professor2.id,
          Math.random() > 0.5 ? classroom.id : classroom2.id,
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

  describe('createClass', () => {
    const mutation = gql`
      mutation CreateClass($data: CreateClassInput!) {
        createClass(data: $data) {
          id
          startDate
          endDate
          course {
            id
          }
          professor {
            id
            hourlyWage
          }

          classroom {
            id
          }
        }
      }
    `;

    it('should create a class', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          startDate: new Date(),
          endDate: new Date(),
          professorId: professor.id,
          courseId: course.id,
          classroomId: classroom.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ createClass: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createClass).toMatchObject({
        id: expect.any(String),
        startDate: variables.data.startDate.toISOString(),
        endDate: variables.data.endDate.toISOString(),
        course: {
          id: course.id,
        },
        professor: {
          id: professor.id,
        },
        classroom: {
          id: classroom.id,
        },
      });
    });
  });

  describe('updateClass', () => {
    const mutation = gql`
      mutation UpdateClass($data: UpdateClassInput!) {
        updateClass(data: $data) {
          id
          startDate
          endDate
          course {
            id
          }
          professor {
            id
          }
          classroom {
            id
          }
        }
      }
    `;

    it('should update a class', async () => {
      // Arrange
      await populate();

      const classEntity = await createClass(
        manager.prisma,
        course.id,
        professor.id,
        classroom.id,
      );

      const variables = {
        data: {
          id: classEntity.id,
          startDate: new Date(),
          endDate: new Date(),
          professorId: professor2.id,
          courseId: course2.id,
          classroomId: classroom2.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateClass: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateClass).toMatchObject({
        id: classEntity.id,
        startDate: variables.data.startDate.toISOString(),
        endDate: variables.data.endDate.toISOString(),
        course: {
          id: course2.id,
        },
        professor: {
          id: professor2.id,
        },
        classroom: {
          id: classroom2.id,
        },
      });
    });
  });

  describe('deleteClass', () => {
    const mutation = gql`
      mutation DeleteClass($id: String!) {
        deleteClass(id: $id) {
          id
          startDate
          endDate
          professor {
            id
          }
          course {
            id
          }
          classroom {
            id
          }
        }
      }
    `;

    it('should delete a class', async () => {
      // Arrange
      await populate();

      const classEntity = await createClass(
        manager.prisma,
        course.id,
        professor.id,
        classroom.id,
      );

      const variables = {
        id: classEntity.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteClass: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteClass).toMatchObject({
        id: classEntity.id,
        startDate: classEntity.startDate.toISOString(),
        endDate: classEntity.endDate.toISOString(),
        course: {
          id: classEntity.course.id,
        },
        professor: {
          id: classEntity.professor.id,
        },
        classroom: {
          id: classEntity.classroom.id,
        },
      });

      const deletedClass = await manager.prisma.class.findUnique({
        where: { id: classEntity.id },
      });

      expect(deletedClass).not.toBeNull();
      expect(deletedClass?.deleted).toBeTrue();
    });
  });

  describe('getClass', () => {
    const query = gql`
      query GetClass($id: String!) {
        getClass(id: $id) {
          id
          startDate
          endDate
          course {
            id
          }
          professor {
            id
          }
          classroom {
            id
          }
        }
      }
    `;

    it('should get a class', async () => {
      // Arrange
      await populate();

      const classEntity = classes[0];

      const variables = {
        id: classEntity.id,
      };

      // Act
      const result = await manager.sendQuery<{ getClass: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getClass).toMatchObject({
        id: classEntity.id,
        startDate: classEntity.startDate.toISOString(),
        endDate: classEntity.endDate.toISOString(),
        course: {
          id: classEntity.course.id,
        },
        professor: {
          id: classEntity.professor.id,
        },
        classroom: {
          id: classEntity.classroom.id,
        },
      });
    });
  });

  describe('getClasses', () => {
    const query = gql`
      query GetClasses {
        getClasses {
          id
          startDate
          endDate
          course {
            id
          }
          professor {
            id
          }
          classroom {
            id
          }
        }
      }
    `;

    it('should get classes', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getClasses: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getClasses).toEqual(
        classes.map((classEntity) => ({
          id: classEntity.id,
          startDate: classEntity.startDate.toISOString(),
          endDate: classEntity.endDate.toISOString(),
          course: {
            id: classEntity.course.id,
          },
          professor: {
            id: classEntity.professor.id,
          },
          classroom: {
            id: classEntity.classroom.id,
          },
        })),
      );
    });
  });
});
