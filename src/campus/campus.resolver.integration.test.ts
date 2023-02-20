import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import { Address, Building, Campus } from '@prisma/client';
import 'jest-extended';
import { createCampus } from 'src/prisma/seed/campus';
import { createBuilding } from 'src/prisma/seed/building';

describe('CampusResolver', () => {
  const manager = new IntegrationTestManager();

  let campuses = <
    (Campus & {
      address: Address;
      buildings: Building[];
    })[]
  >[];

  const populate = async (count = 10) => {
    campuses = [];

    for (let i = 0; i < count; i++) {
      campuses.push(await createCampus(manager.prisma));
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createCampus', () => {
    const mutation = gql`
      mutation CreateCampus($data: CreateCampusInput!) {
        createCampus(data: $data) {
          id
          name
          address {
            street
            city
            country
            zipCode
          }
        }
      }
    `;

    it('should create a campus', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Campus',
          address: {
            street: 'Street',
            city: 'City',
            country: 'Country',
            zipCode: '00000',
          },
        },
      };

      // Act
      const result = await manager.sendQuery<{ createCampus: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createCampus).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
        address: {
          street: variables.data.address.street,
          city: variables.data.address.city,
          country: variables.data.address.country,
          zipCode: variables.data.address.zipCode,
        },
      });
    });
  });

  describe('updateCampus', () => {
    const mutation = gql`
      mutation UpdateCampus($data: UpdateCampusInput!) {
        updateCampus(data: $data) {
          id
          name
          address {
            street
            city
            country
            zipCode
          }
        }
      }
    `;

    it('should update a campus', async () => {
      // Arrange
      await populate();

      const campus = await createCampus(manager.prisma);

      const variables = {
        data: {
          id: campus.id,
          name: 'Updated Campus',
          address: {
            street: 'Updated Street',
            city: 'Updated City',
            country: 'Updated Country',
            zipCode: 'Updated Zip',
          },
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateCampus: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateCampus).toMatchObject({
        id: campus.id,
        name: variables.data.name,
        address: {
          street: variables.data.address.street,
          city: variables.data.address.city,
          country: variables.data.address.country,
          zipCode: variables.data.address.zipCode,
        },
      });
    });
  });

  describe('deleteCampus', () => {
    const mutation = gql`
      mutation DeleteCampus($id: String!) {
        deleteCampus(id: $id) {
          id
          name
          address {
            street
            city
            country
            zipCode
          }
        }
      }
    `;

    it('should delete a campus', async () => {
      // Arrange
      await populate();

      const campus = await createCampus(manager.prisma);

      const variables = {
        id: campus.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteCampus: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteCampus).toMatchObject({
        id: campus.id,
        name: campus.name,
        address: {
          street: campus.address.street,
          city: campus.address.city,
          country: campus.address.country,
          zipCode: campus.address.zipCode,
        },
      });

      const deletedCampus = await manager.prisma.campus.findUnique({
        where: { id: campus.id },
      });

      expect(deletedCampus).not.toBeNull();
      expect(deletedCampus?.deleted).toBeTrue();
    });
  });

  describe('getCampus', () => {
    const query = gql`
      query GetCampus($id: String!) {
        getCampus(id: $id) {
          id
          name
          address {
            street
            city
            country
            zipCode
          }
          buildings {
            id
            name
          }
        }
      }
    `;

    it('should get a campus', async () => {
      // Arrange
      await populate();

      const campus = campuses[0];

      const buildings = [
        await createBuilding(manager.prisma, campus.id),
        await createBuilding(manager.prisma, campus.id),
        await createBuilding(manager.prisma, campus.id),
      ];

      const variables = {
        id: campus.id,
      };

      // Act
      const result = await manager.sendQuery<{ getCampus: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getCampus).toMatchObject({
        id: campus.id,
        name: campus.name,
        address: {
          street: campus.address.street,
          city: campus.address.city,
          country: campus.address.country,
          zipCode: campus.address.zipCode,
        },
        buildings: buildings.map((building) => ({
          id: building.id,
          name: building.name,
        })),
      });
    });
  });

  describe('getCampuses', () => {
    const query = gql`
      query GetCampuses {
        getCampuses {
          id
          name
          address {
            street
            city
            country
            zipCode
          }
        }
      }
    `;

    it('should get campuses', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getCampuses: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getCampuses).toEqual(
        campuses.map((campus) => ({
          id: campus.id,
          name: campus.name,
          address: {
            street: campus.address.street,
            city: campus.address.city,
            country: campus.address.country,
            zipCode: campus.address.zipCode,
          },
        })),
      );
    });
  });
});
