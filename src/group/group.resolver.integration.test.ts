import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import 'jest-extended';
import { createGroup } from 'src/prisma/seed/group';
import { Curriculum, Group } from '@prisma/client';
import { createCurriculum } from 'src/prisma/seed/curriculum';

describe('GroupResolver', () => {
  const manager = new IntegrationTestManager();

  let groups = <Group[]>[];
  let curriculum: Curriculum;
  let curriculum2: Curriculum;

  const populate = async (count = 10) => {
    groups = [];

    curriculum = await createCurriculum(manager.prisma);
    curriculum2 = await createCurriculum(manager.prisma);

    for (let i = 0; i < count; i++) {
      groups.push(await createGroup(manager.prisma, curriculum.id));
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createGroup', () => {
    const mutation = gql`
      mutation CreateGroup($data: CreateGroupInput!) {
        createGroup(data: $data) {
          id
          name
          curriculum {
            id
            name
          }
        }
      }
    `;

    it('should create a group', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Group',
          curriculumId: curriculum.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ createGroup: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createGroup).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
        curriculum: {
          id: curriculum.id,
          name: curriculum.name,
        },
      });
    });
  });

  describe('updateGroup', () => {
    const mutation = gql`
      mutation UpdateGroup($data: UpdateGroupInput!) {
        updateGroup(data: $data) {
          id
          name
          curriculum {
            id
            name
          }
        }
      }
    `;

    it('should update a group', async () => {
      // Arrange
      await populate();

      const group = await createGroup(manager.prisma, curriculum.id);

      const variables = {
        data: {
          id: group.id,
          name: 'Generic Group',
          curriculumId: curriculum2.id,
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateGroup: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateGroup).toMatchObject({
        id: group.id,
        name: variables.data.name,
        curriculum: {
          id: curriculum2.id,
          name: curriculum2.name,
        },
      });
    });
  });

  describe('deleteGroup', () => {
    const mutation = gql`
      mutation DeleteGroup($id: String!) {
        deleteGroup(id: $id) {
          id
          name
          curriculum {
            id
            name
          }
        }
      }
    `;

    it('should delete a group', async () => {
      // Arrange
      await populate();

      const group = await createGroup(manager.prisma, curriculum.id);

      const variables = {
        id: group.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteGroup: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteGroup).toMatchObject({
        id: group.id,
        name: group.name,
        curriculum: {
          id: curriculum.id,
          name: curriculum.name,
        },
      });

      const deletedGroup = await manager.prisma.group.findUnique({
        where: { id: group.id },
      });

      expect(deletedGroup).not.toBeNull();
      expect(deletedGroup?.deleted).toBeTrue();
    });
  });

  describe('getGroup', () => {
    const query = gql`
      query GetGroup($id: String!) {
        getGroup(id: $id) {
          id
          name
          curriculum {
            id
            name
          }
        }
      }
    `;

    it('should get a group', async () => {
      // Arrange
      await populate();

      const group = groups[0];

      const variables = {
        id: group.id,
      };

      // Act
      const result = await manager.sendQuery<{ getGroup: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getGroup).toMatchObject({
        id: group.id,
        name: group.name,
        curriculum: {
          id: curriculum.id,
          name: curriculum.name,
        },
      });
    });
  });

  describe('getGroups', () => {
    const query = gql`
      query GetGroups {
        getGroups {
          id
          name
          curriculum {
            id
            name
          }
        }
      }
    `;

    it('should get groups', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getGroups: unknown }>(query, {});

      // Assert
      expect(result.data.getGroups).toEqual(
        groups.map((group) => ({
          id: group.id,
          name: group.name,
          curriculum: {
            id: curriculum.id,
            name: curriculum.name,
          },
        })),
      );
    });
  });
});
