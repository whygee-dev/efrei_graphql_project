import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import { Address, Student, Group, Curriculum } from '@prisma/client';
import 'jest-extended';
import { createStudent } from 'src/prisma/seed/student';
import { createGroup } from 'src/prisma/seed/group';
import { createCurriculum } from 'src/prisma/seed/curriculum';
import { PersonalInfo } from 'src/common/graphql/PersonalInfo';

describe('StudentResolver', () => {
  const manager = new IntegrationTestManager();

  let group: Group;
  let group2: Group;
  let curriculum: Curriculum;
  let curriculum2: Curriculum;

  let students = <
    (Student & {
      group: Group;
      curriculum: Curriculum;
      personalInfo: PersonalInfo & {
        address: Address;
      };
    })[]
  >[];

  const populate = async (count = 10) => {
    students = [];
    curriculum = await createCurriculum(manager.prisma);
    curriculum2 = await createCurriculum(manager.prisma);

    group = await createGroup(manager.prisma, curriculum.id);
    group2 = await createGroup(manager.prisma, curriculum2.id);

    for (let i = 0; i < count; i++) {
      students.push(
        await createStudent(manager.prisma, group.id, curriculum.id),
      );
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createStudent', () => {
    const mutation = gql`
      mutation CreateStudent($data: CreateStudentInput!) {
        createStudent(data: $data) {
          id
          personalInfo {
            firstName
            lastName
            email
            birthDate
            address {
              street
              zipCode
              city
              country
            }
          }
          curriculum {
            id
            name
          }
          group {
            id
            name
          }
        }
      }
    `;

    it('should create a student', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          personalInfo: {
            firstName: 'Eren',
            lastName: 'Jeager',
            birthDate: new Date(),
            email: 'eren.jeager@gmail.com',
            address: {
              street: 'Rue 1',
              zipCode: '75001',
              city: 'Paris',
              country: 'France',
            },
          },
          curriculumId: curriculum.id,
          groupId: group.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ createStudent: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createStudent).toMatchObject({
        id: expect.any(String),
        personalInfo: {
          firstName: variables.data.personalInfo.firstName,
          lastName: variables.data.personalInfo.lastName,
          email: variables.data.personalInfo.email,
          birthDate: variables.data.personalInfo.birthDate.toISOString(),
          address: variables.data.personalInfo.address,
        },
        curriculum: {
          id: curriculum.id,
          name: curriculum.name,
        },
        group: {
          id: group.id,
          name: group.name,
        },
      });
    });
  });

  describe('updateStudent', () => {
    const mutation = gql`
      mutation UpdateStudent($data: UpdateStudentInput!) {
        updateStudent(data: $data) {
          id
          personalInfo {
            firstName
            lastName
            email
            birthDate
            address {
              street
              zipCode
              city
              country
            }
          }
          curriculum {
            id
          }
          group {
            id
          }
        }
      }
    `;

    it('should update a student', async () => {
      // Arrange
      await populate();

      const student = students[0];

      const variables = {
        data: {
          id: student.id,
          personalInfo: {
            email: 'updated-email@gmail.com',
            firstName: 'Updated',
            birthDate: new Date(),
            address: {
              street: 'Updated Street',
              city: 'Updated City',
              country: 'Updated Country',
            },
          },
          curriculumId: curriculum2.id,
          groupId: group2.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateStudent: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateStudent).toMatchObject({
        id: student.id,
        personalInfo: {
          firstName: variables.data.personalInfo.firstName,
          lastName: student.personalInfo.lastName,
          email: variables.data.personalInfo.email,
          birthDate: variables.data.personalInfo.birthDate.toISOString(),
          address: {
            street: variables.data.personalInfo.address.street,
            zipCode: student.personalInfo.address.zipCode,
            city: variables.data.personalInfo.address.city,
            country: variables.data.personalInfo.address.country,
          },
        },
        curriculum: {
          id: curriculum2.id,
        },
        group: {
          id: group2.id,
        },
      });
    });
  });

  describe('deleteStudent', () => {
    const mutation = gql`
      mutation DeleteStudent($id: String!) {
        deleteStudent(id: $id) {
          id
          personalInfo {
            firstName
            lastName
          }
        }
      }
    `;

    it('should delete a student', async () => {
      // Arrange
      await populate();

      const student = await createStudent(
        manager.prisma,
        group.id,
        curriculum.id,
      );

      const variables = {
        id: student.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteStudent: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteStudent).toMatchObject({
        id: student.id,
        personalInfo: {
          firstName: student.personalInfo.firstName,
          lastName: student.personalInfo.lastName,
        },
      });

      const deletedStudent = await manager.prisma.student.findUnique({
        where: { id: student.id },
      });

      expect(deletedStudent).not.toBeNull();
      expect(deletedStudent?.deleted).toBeTrue();
    });
  });

  describe('getStudent', () => {
    const query = gql`
      query GetStudent($id: String!) {
        getStudent(id: $id) {
          id
          personalInfo {
            firstName
            lastName
            email
            birthDate
            address {
              street
              zipCode
              city
              country
            }
          }
          curriculum {
            id
            name
          }
          group {
            id
            name
          }
        }
      }
    `;

    it('should get a student', async () => {
      // Arrange
      await populate();

      const student = students[0];

      const variables = {
        id: student.id,
      };

      // Act
      const result = await manager.sendQuery<{ getStudent: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getStudent).toMatchObject({
        id: student.id,
        personalInfo: {
          firstName: student.personalInfo.firstName,
          lastName: student.personalInfo.lastName,
          email: student.personalInfo.email,
          birthDate: student.personalInfo.birthDate.toISOString(),
          address: {
            street: student.personalInfo.address.street,
            zipCode: student.personalInfo.address.zipCode,
            city: student.personalInfo.address.city,
            country: student.personalInfo.address.country,
          },
        },
        curriculum: {
          id: curriculum.id,
          name: curriculum.name,
        },
        group: {
          id: group.id,
          name: group.name,
        },
      });
    });
  });

  describe('getStudents', () => {
    const query = gql`
      query GetStudents {
        getStudents {
          id
          personalInfo {
            firstName
            lastName
            email
            birthDate
            address {
              street
              zipCode
              city
              country
            }
          }
          curriculum {
            id
            name
          }
          group {
            id
            name
          }
        }
      }
    `;

    it('should get students', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getStudents: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getStudents).toEqual(
        students.map((student) => ({
          id: student.id,
          personalInfo: {
            firstName: student.personalInfo.firstName,
            lastName: student.personalInfo.lastName,
            email: student.personalInfo.email,
            birthDate: student.personalInfo.birthDate.toISOString(),
            address: {
              street: student.personalInfo.address.street,
              zipCode: student.personalInfo.address.zipCode,
              city: student.personalInfo.address.city,
              country: student.personalInfo.address.country,
            },
          },
          curriculum: {
            id: curriculum.id,
            name: curriculum.name,
          },
          group: {
            id: group.id,
            name: group.name,
          },
        })),
      );
    });
  });
});
