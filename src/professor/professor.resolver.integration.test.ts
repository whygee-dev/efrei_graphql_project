import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import { Address, Professor, PersonalInfo } from '@prisma/client';
import { createProfessor } from 'src/prisma/seed/professor';

describe('ProfessorResolver', () => {
  const manager = new IntegrationTestManager();

  let professors = <
    (Professor & { personalInfo: PersonalInfo & { address: Address } })[]
  >[];

  const populate = async (count = 10) => {
    professors = [];

    for (let i = 0; i < count; i++) {
      professors.push(await createProfessor(manager.prisma));
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createProfessor', () => {
    const mutation = gql`
      mutation CreateProfessor($data: CreateProfessorInput!) {
        createProfessor(data: $data) {
          id
          hourlyWage
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
        }
      }
    `;

    it('should create a professor', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          hourlyWage: 100,
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
        },
      };

      // Act
      const result = await manager.sendQuery<{ createProfessor: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createProfessor).toMatchObject({
        id: expect.any(String),
        hourlyWage: variables.data.hourlyWage,
        personalInfo: {
          firstName: variables.data.personalInfo.firstName,
          lastName: variables.data.personalInfo.lastName,
          email: variables.data.personalInfo.email,
          birthDate: variables.data.personalInfo.birthDate.toISOString(),
          address: variables.data.personalInfo.address,
        },
      });
    });
  });

  describe('updateProfessor', () => {
    const mutation = gql`
      mutation UpdateProfessor($data: UpdateProfessorInput!) {
        updateProfessor(data: $data) {
          id
          hourlyWage
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
        }
      }
    `;

    it('should update a professor', async () => {
      // Arrange
      await populate();

      const professor = professors[0];

      const variables = {
        data: {
          id: professor.id,
          hourlyWage: 100,
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
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateProfessor: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateProfessor).toMatchObject({
        id: professor.id,
        hourlyWage: variables.data.hourlyWage,
        personalInfo: {
          firstName: variables.data.personalInfo.firstName,
          lastName: professor.personalInfo.lastName,
          email: variables.data.personalInfo.email,
          birthDate: variables.data.personalInfo.birthDate.toISOString(),
          address: {
            street: variables.data.personalInfo.address.street,
            zipCode: professor.personalInfo.address.zipCode,
            city: variables.data.personalInfo.address.city,
            country: variables.data.personalInfo.address.country,
          },
        },
      });
    });
  });

  describe('deleteProfessor', () => {
    const mutation = gql`
      mutation DeleteProfessor($id: String!) {
        deleteProfessor(id: $id) {
          id
          personalInfo {
            firstName
            lastName
          }
        }
      }
    `;

    it('should delete a professor', async () => {
      // Arrange
      await populate();

      const professor = await createProfessor(manager.prisma);

      const variables = {
        id: professor.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteProfessor: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteProfessor).toMatchObject({
        id: professor.id,
        personalInfo: {
          firstName: professor.personalInfo.firstName,
          lastName: professor.personalInfo.lastName,
        },
      });

      const deletedProfessor = await manager.prisma.professor.findUnique({
        where: { id: professor.id },
      });

      expect(deletedProfessor).not.toBeNull();
      expect(deletedProfessor?.deleted).toBeTrue();
    });
  });

  describe('getProfessor', () => {
    const query = gql`
      query GetProfessor($id: String!) {
        getProfessor(id: $id) {
          id
          hourlyWage
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
        }
      }
    `;

    it('should get a professor', async () => {
      // Arrange
      await populate();

      const professor = professors[0];

      const variables = {
        id: professor.id,
      };

      // Act
      const result = await manager.sendQuery<{ getProfessor: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getProfessor).toMatchObject({
        id: professor.id,
        personalInfo: {
          firstName: professor.personalInfo.firstName,
          lastName: professor.personalInfo.lastName,
          email: professor.personalInfo.email,
          birthDate: professor.personalInfo.birthDate.toISOString(),
          address: {
            street: professor.personalInfo.address.street,
            zipCode: professor.personalInfo.address.zipCode,
            city: professor.personalInfo.address.city,
            country: professor.personalInfo.address.country,
          },
        },
        hourlyWage: professor.hourlyWage,
      });
    });
  });

  describe('getProfessors', () => {
    const query = gql`
      query GetProfessors {
        getProfessors {
          id
          hourlyWage
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
        }
      }
    `;

    it('should get professors', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getProfessors: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getProfessors).toEqual(
        professors.map((professor) => ({
          id: professor.id,
          personalInfo: {
            firstName: professor.personalInfo.firstName,
            lastName: professor.personalInfo.lastName,
            email: professor.personalInfo.email,
            birthDate: professor.personalInfo.birthDate.toISOString(),
            address: {
              street: professor.personalInfo.address.street,
              zipCode: professor.personalInfo.address.zipCode,
              city: professor.personalInfo.address.city,
              country: professor.personalInfo.address.country,
            },
          },
          hourlyWage: professor.hourlyWage,
        })),
      );
    });
  });
});
