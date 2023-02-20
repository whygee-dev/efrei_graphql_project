import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import {
  Address,
  Course,
  GenericCourse,
  PersonalInfo,
  Professor,
} from '@prisma/client';
import 'jest-extended';
import { createProfessor } from 'src/prisma/seed/professor';
import { createGenericCourse } from 'src/prisma/seed/genericCourse';
import { createCourse } from 'src/prisma/seed/course';

describe('CourseResolver', () => {
  const manager = new IntegrationTestManager();

  let professor: Professor & {
      personalInfo: PersonalInfo & { address: Address };
    },
    genericCourse: GenericCourse;
  let professor2: Professor & {
      personalInfo: PersonalInfo & { address: Address };
    },
    genericCourse2: GenericCourse;
  let courses = <
    (Course & {
      professor: Professor & {
        personalInfo: PersonalInfo & { address: Address };
      };
      genericCourse: GenericCourse;
    })[]
  >[];

  const populate = async (count = 10) => {
    courses = [];
    professor = await createProfessor(manager.prisma);
    professor2 = await createProfessor(manager.prisma);

    genericCourse = await createGenericCourse(manager.prisma);
    genericCourse2 = await createGenericCourse(manager.prisma);

    for (let i = 0; i < count; i++) {
      courses.push(
        await createCourse(
          manager.prisma,
          Math.random() > 0.5 ? professor.id : professor2.id,
          Math.random() > 0.5 ? genericCourse.id : genericCourse2.id,
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

  describe('createCourse', () => {
    const mutation = gql`
      mutation CreateCourse($data: CreateCourseInput!) {
        createCourse(data: $data) {
          id
          startDate
          endDate
          genericCourse {
            id
            name
          }
          professor {
            id
            hourlyWage
            personalInfo {
              lastName
              firstName
              address {
                street
                city
                zipCode
                country
              }
            }
          }
        }
      }
    `;

    it('should create a course', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          startDate: new Date(),
          endDate: new Date(),
          professorId: professor.id,
          genericCourseId: genericCourse.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ createCourse: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createCourse).toMatchObject({
        id: expect.any(String),
        startDate: variables.data.startDate.toISOString(),
        endDate: variables.data.endDate.toISOString(),
        genericCourse: {
          id: genericCourse.id,
          name: genericCourse.name,
        },
        professor: {
          id: professor.id,
          hourlyWage: professor.hourlyWage,
          personalInfo: {
            firstName: professor.personalInfo.firstName,
            lastName: professor.personalInfo.lastName,
            address: {
              street: professor.personalInfo.address.street,
              city: professor.personalInfo.address.city,
              zipCode: professor.personalInfo.address.zipCode,
              country: professor.personalInfo.address.country,
            },
          },
        },
      });
    });
  });

  describe('updateCourse', () => {
    const mutation = gql`
      mutation UpdateCourse($data: UpdateCourseInput!) {
        updateCourse(data: $data) {
          id
          startDate
          endDate
          genericCourse {
            id
            name
          }
          professor {
            id
            hourlyWage
            personalInfo {
              lastName
              firstName
              address {
                street
                city
                zipCode
                country
              }
            }
          }
        }
      }
    `;

    it('should update a course', async () => {
      // Arrange
      await populate();

      const course = await createCourse(
        manager.prisma,
        professor.id,
        genericCourse.id,
      );

      const variables = {
        data: {
          id: course.id,
          startDate: new Date(),
          endDate: new Date(),
          professorId: professor2.id,
          genericCourseId: genericCourse2.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateCourse: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateCourse).toMatchObject({
        id: course.id,
        startDate: variables.data.startDate.toISOString(),
        endDate: variables.data.endDate.toISOString(),
        genericCourse: {
          id: genericCourse2.id,
          name: genericCourse2.name,
        },
        professor: {
          id: professor2.id,
          hourlyWage: professor2.hourlyWage,
          personalInfo: {
            firstName: professor2.personalInfo.firstName,
            lastName: professor2.personalInfo.lastName,
            address: {
              street: professor2.personalInfo.address.street,
              city: professor2.personalInfo.address.city,
              zipCode: professor2.personalInfo.address.zipCode,
              country: professor2.personalInfo.address.country,
            },
          },
        },
      });
    });
  });

  describe('deleteCourse', () => {
    const mutation = gql`
      mutation DeleteCourse($id: String!) {
        deleteCourse(id: $id) {
          id
          startDate
          endDate
          genericCourse {
            id
            name
          }
          professor {
            id
            hourlyWage
            personalInfo {
              lastName
              firstName
              address {
                street
                city
                zipCode
                country
              }
            }
          }
        }
      }
    `;

    it('should delete a course', async () => {
      // Arrange
      await populate();

      const course = await createCourse(
        manager.prisma,
        professor.id,
        genericCourse.id,
      );

      const variables = {
        id: course.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteCourse: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteCourse).toMatchObject({
        id: course.id,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        genericCourse: {
          id: genericCourse.id,
          name: genericCourse.name,
        },
        professor: {
          id: course.professor.id,
          hourlyWage: course.professor.hourlyWage,
          personalInfo: {
            firstName: course.professor.personalInfo.firstName,
            lastName: course.professor.personalInfo.lastName,
            address: {
              street: course.professor.personalInfo.address.street,
              city: course.professor.personalInfo.address.city,
              zipCode: course.professor.personalInfo.address.zipCode,
              country: course.professor.personalInfo.address.country,
            },
          },
        },
      });

      const deletedCourse = await manager.prisma.course.findUnique({
        where: { id: course.id },
      });

      expect(deletedCourse).not.toBeNull();
      expect(deletedCourse?.deleted).toBeTrue();
    });
  });

  describe('getCourse', () => {
    const query = gql`
      query GetCourse($id: String!) {
        getCourse(id: $id) {
          id
          startDate
          endDate
          genericCourse {
            id
            name
          }
          professor {
            id
            hourlyWage
            personalInfo {
              lastName
              firstName
              address {
                street
                city
                zipCode
                country
              }
            }
          }
        }
      }
    `;

    it('should get a course', async () => {
      // Arrange
      await populate();

      const course = courses[0];

      const variables = {
        id: course.id,
      };

      // Act
      const result = await manager.sendQuery<{ getCourse: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getCourse).toMatchObject({
        id: course.id,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        genericCourse: {
          id: course.genericCourse.id,
          name: course.genericCourse.name,
        },
        professor: {
          id: course.professor.id,
          hourlyWage: course.professor.hourlyWage,
          personalInfo: {
            firstName: course.professor.personalInfo.firstName,
            lastName: course.professor.personalInfo.lastName,
            address: {
              street: course.professor.personalInfo.address.street,
              city: course.professor.personalInfo.address.city,
              zipCode: course.professor.personalInfo.address.zipCode,
              country: course.professor.personalInfo.address.country,
            },
          },
        },
      });
    });
  });

  describe('getCourses', () => {
    const query = gql`
      query GetCourses {
        getCourses {
          id
          startDate
          endDate
          genericCourse {
            id
            name
          }
          professor {
            id
            hourlyWage
            personalInfo {
              lastName
              firstName
              address {
                street
                city
                zipCode
                country
              }
            }
          }
        }
      }
    `;

    it('should get courses', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getCourses: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getCourses).toEqual(
        courses.map((course) => ({
          id: course.id,
          startDate: course.startDate.toISOString(),
          endDate: course.endDate.toISOString(),
          genericCourse: {
            id: course.genericCourse.id,
            name: course.genericCourse.name,
          },
          professor: {
            id: course.professor.id,
            hourlyWage: course.professor.hourlyWage,
            personalInfo: {
              firstName: course.professor.personalInfo.firstName,
              lastName: course.professor.personalInfo.lastName,
              address: {
                street: course.professor.personalInfo.address.street,
                city: course.professor.personalInfo.address.city,
                zipCode: course.professor.personalInfo.address.zipCode,
                country: course.professor.personalInfo.address.country,
              },
            },
          },
        })),
      );
    });
  });
});
