import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import { Building, Campus } from '@prisma/client';
import 'jest-extended';
import { createBuilding } from 'src/prisma/seed/building';
import { createCampus } from 'src/prisma/seed/campus';

describe('BuildingResolver', () => {
  const manager = new IntegrationTestManager();

  let campus: Campus;
  let campus2: Campus;

  let buildings = <
    (Building & {
      campus: Campus;
    })[]
  >[];

  const populate = async (count = 10) => {
    buildings = [];

    campus = await createCampus(manager.prisma);
    campus2 = await createCampus(manager.prisma);

    for (let i = 0; i < count; i++) {
      buildings.push(
        await createBuilding(
          manager.prisma,
          Math.random() > 0.5 ? campus.id : campus2.id,
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

  describe('createBuilding', () => {
    const mutation = gql`
      mutation CreateBuilding($data: CreateBuildingInput!) {
        createBuilding(data: $data) {
          id
          name
          campus {
            id
          }
        }
      }
    `;

    it('should create a building', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Building',
          campusId: campus.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ createBuilding: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createBuilding).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
        campus: {
          id: campus.id,
        },
      });
    });
  });

  describe('updateBuilding', () => {
    const mutation = gql`
      mutation UpdateBuilding($data: UpdateBuildingInput!) {
        updateBuilding(data: $data) {
          id
          name
          campus {
            id
          }
        }
      }
    `;

    it('should update a building', async () => {
      // Arrange
      await populate();

      const building = await createBuilding(manager.prisma, campus.id);

      const variables = {
        data: {
          id: building.id,
          name: 'Updated Building',
          campusId: campus2.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateBuilding: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateBuilding).toMatchObject({
        id: building.id,
        name: variables.data.name,
        campus: {
          id: campus2.id,
        },
      });
    });
  });

  describe('deleteBuilding', () => {
    const mutation = gql`
      mutation DeleteBuilding($id: String!) {
        deleteBuilding(id: $id) {
          id
          name
          campus {
            id
          }
        }
      }
    `;

    it('should delete a building', async () => {
      // Arrange
      await populate();

      const building = await createBuilding(manager.prisma, campus.id);

      const variables = {
        id: building.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteBuilding: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteBuilding).toMatchObject({
        id: building.id,
        name: building.name,
        campus: {
          id: building.campus.id,
        },
      });

      const deletedBuilding = await manager.prisma.building.findUnique({
        where: { id: building.id },
      });

      expect(deletedBuilding).not.toBeNull();
      expect(deletedBuilding?.deleted).toBeTrue();
    });
  });

  describe('getBuilding', () => {
    const query = gql`
      query GetBuilding($id: String!) {
        getBuilding(id: $id) {
          id
          name
          campus {
            id
          }
        }
      }
    `;

    it('should get a building', async () => {
      // Arrange
      await populate();

      const building = buildings[0];

      const variables = {
        id: building.id,
      };

      // Act
      const result = await manager.sendQuery<{ getBuilding: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getBuilding).toMatchObject({
        id: building.id,
        name: building.name,
        campus: {
          id: building.campus.id,
        },
      });
    });
  });

  describe('getBuildings', () => {
    const query = gql`
      query GetBuildings {
        getBuildings {
          id
          name
          campus {
            id
          }
        }
      }
    `;

    it('should get buildings', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getBuildings: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getBuildings).toEqual(
        buildings.map((building) => ({
          id: building.id,
          name: building.name,
          campus: {
            id: building.campus.id,
          },
        })),
      );
    });
  });
});
