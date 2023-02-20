import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../test/IntegrationTestManager';
import 'jest-extended';
import { Curriculum } from './curriculum.model';
import { createCurriculum } from 'src/prisma/seed/curriculum';

describe('CurriculumResolver', () => {
  const manager = new IntegrationTestManager();

  let curriculums = <Curriculum[]>[];

  const populate = async (count = 10) => {
    curriculums = [];

    for (let i = 0; i < count; i++) {
      curriculums.push(await createCurriculum(manager.prisma));
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createCurriculum', () => {
    const mutation = gql`
      mutation CreateCurriculum($data: CreateCurriculumInput!) {
        createCurriculum(data: $data) {
          id
          name
        }
      }
    `;

    it('should create a curriculum', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Curriculum',
        },
      };

      // Act
      const result = await manager.sendQuery<{ createCurriculum: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createCurriculum).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
      });
    });
  });

  describe('updateCurriculum', () => {
    const mutation = gql`
      mutation UpdateCurriculum($data: UpdateCurriculumInput!) {
        updateCurriculum(data: $data) {
          id
          name
        }
      }
    `;

    it('should update a curriculum', async () => {
      // Arrange
      await populate();

      const curriculum = await createCurriculum(manager.prisma);

      const variables = {
        data: {
          id: curriculum.id,
          name: 'Generic Curriculum',
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateCurriculum: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateCurriculum).toMatchObject({
        id: curriculum.id,
        name: variables.data.name,
      });
    });
  });

  describe('deleteCurriculum', () => {
    const mutation = gql`
      mutation DeleteCurriculum($id: String!) {
        deleteCurriculum(id: $id) {
          id
          name
        }
      }
    `;

    it('should delete a curriculum', async () => {
      // Arrange
      await populate();

      const curriculum = await createCurriculum(manager.prisma);

      const variables = {
        id: curriculum.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteCurriculum: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteCurriculum).toMatchObject({
        id: curriculum.id,
        name: curriculum.name,
      });

      const deletedCurriculum = await manager.prisma.curriculum.findUnique({
        where: { id: curriculum.id },
      });

      expect(deletedCurriculum).not.toBeNull();
      expect(deletedCurriculum?.deleted).toBeTrue();
    });
  });

  describe('getCurriculum', () => {
    const query = gql`
      query GetCurriculum($id: String!) {
        getCurriculum(id: $id) {
          id
          name
        }
      }
    `;

    it('should get a curriculum', async () => {
      // Arrange
      await populate();

      const curriculum = curriculums[0];

      const variables = {
        id: curriculum.id,
      };

      // Act
      const result = await manager.sendQuery<{ getCurriculum: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getCurriculum).toMatchObject({
        id: curriculum.id,
        name: curriculum.name,
      });
    });
  });

  describe('getCurriculums', () => {
    const query = gql`
      query GetCurriculums {
        getCurriculums {
          id
          name
        }
      }
    `;

    it('should get curriculums', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getCurriculums: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getCurriculums).toEqual(
        curriculums.map((curriculum) => ({
          id: curriculum.id,
          name: curriculum.name,
        })),
      );
    });
  });
});
