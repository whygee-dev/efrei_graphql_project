import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import { Classroom, Building, Campus } from '@prisma/client';
import 'jest-extended';
import { createClassroom } from 'src/prisma/seed/classroom';
import { createBuilding } from 'src/prisma/seed/building';
import { createCampus } from 'src/prisma/seed/campus';

describe('ClassroomResolver', () => {
  const manager = new IntegrationTestManager();

  let building: Building;
  let building2: Building;
  let campus: Campus;
  let campus2: Campus;

  let classrooms = <
    (Classroom & {
      building: Building;
      campus: Campus;
    })[]
  >[];

  const populate = async (count = 10) => {
    classrooms = [];

    campus = await createCampus(manager.prisma);
    campus2 = await createCampus(manager.prisma);

    building = await createBuilding(manager.prisma, campus.id);
    building2 = await createBuilding(manager.prisma, campus.id);

    for (let i = 0; i < count; i++) {
      classrooms.push(
        await createClassroom(
          manager.prisma,
          Math.random() > 0.5 ? campus.id : campus2.id,
          Math.random() > 0.5 ? building.id : building2.id,
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

  describe('createClassroom', () => {
    const mutation = gql`
      mutation CreateClassroom($data: CreateClassroomInput!) {
        createClassroom(data: $data) {
          id
          name
          floor
          campus {
            id
          }
          building {
            id
          }
        }
      }
    `;

    it('should create a classroom', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Classroom',
          buildingId: building.id,
          campusId: campus.id,
          floor: 1,
        },
      };

      // Act
      const result = await manager.sendQuery<{ createClassroom: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createClassroom).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
        campus: {
          id: campus.id,
        },
        building: {
          id: building.id,
        },
        floor: variables.data.floor,
      });
    });
  });

  describe('updateClassroom', () => {
    const mutation = gql`
      mutation UpdateClassroom($data: UpdateClassroomInput!) {
        updateClassroom(data: $data) {
          id
          name
          floor
          campus {
            id
          }
          building {
            id
          }
        }
      }
    `;

    it('should update a classroom', async () => {
      // Arrange
      await populate();

      const classroom = await createClassroom(
        manager.prisma,
        campus.id,
        building.id,
      );

      const variables = {
        data: {
          id: classroom.id,
          name: 'Updated Classroom',
          campusId: campus2.id,
          buildingId: building2.id,
          floor: 2,
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateClassroom: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateClassroom).toMatchObject({
        id: classroom.id,
        name: variables.data.name,
        campus: {
          id: campus2.id,
        },
        building: {
          id: building2.id,
        },
        floor: variables.data.floor,
      });
    });
  });

  describe('deleteClassroom', () => {
    const mutation = gql`
      mutation DeleteClassroom($id: String!) {
        deleteClassroom(id: $id) {
          id
          name
          floor
          building {
            id
          }
          campus {
            id
          }
        }
      }
    `;

    it('should delete a classroom', async () => {
      // Arrange
      await populate();

      const classroom = await createClassroom(
        manager.prisma,
        campus.id,
        building.id,
      );

      const variables = {
        id: classroom.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteClassroom: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteClassroom).toMatchObject({
        id: classroom.id,
        name: classroom.name,
        campus: {
          id: classroom.campus.id,
        },
        building: {
          id: classroom.building.id,
        },
        floor: classroom.floor,
      });

      const deletedClassroom = await manager.prisma.classroom.findUnique({
        where: { id: classroom.id },
      });

      expect(deletedClassroom).not.toBeNull();
      expect(deletedClassroom?.deleted).toBeTrue();
    });
  });

  describe('getClassroom', () => {
    const query = gql`
      query GetClassroom($id: String!) {
        getClassroom(id: $id) {
          id
          name
          floor
          campus {
            id
          }
          building {
            id
          }
        }
      }
    `;

    it('should get a classroom', async () => {
      // Arrange
      await populate();

      const classroom = classrooms[0];

      const variables = {
        id: classroom.id,
      };

      // Act
      const result = await manager.sendQuery<{ getClassroom: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getClassroom).toMatchObject({
        id: classroom.id,
        name: classroom.name,
        campus: {
          id: classroom.campus.id,
        },
        building: {
          id: classroom.building.id,
        },
        floor: classroom.floor,
      });
    });
  });

  describe('getClassrooms', () => {
    const query = gql`
      query GetClassrooms {
        getClassrooms {
          id
          name
          floor
          campus {
            id
          }
          building {
            id
          }
        }
      }
    `;

    it('should get classrooms', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getClassrooms: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getClassrooms).toEqual(
        classrooms.map((classroom) => ({
          id: classroom.id,
          name: classroom.name,
          campus: {
            id: classroom.campus.id,
          },
          building: {
            id: classroom.building.id,
          },
          floor: classroom.floor,
        })),
      );
    });
  });
});
