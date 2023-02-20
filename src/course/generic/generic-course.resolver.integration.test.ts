import { gql } from 'apollo-server-express';
import { IntegrationTestManager } from '../../test/IntegrationTestManager';
import { GenericCourse } from '@prisma/client';
import 'jest-extended';
import { createGenericCourse } from 'src/prisma/seed/genericCourse';

describe('GenericCourseResolver', () => {
  const manager = new IntegrationTestManager();

  let genericGenericCourses = <GenericCourse[]>[];

  const populate = async (count = 10) => {
    genericGenericCourses = [];

    for (let i = 0; i < count; i++) {
      genericGenericCourses.push(await createGenericCourse(manager.prisma));
    }
  };

  beforeAll(async () => {
    await manager.beforeAll();
  });

  afterAll(async () => {
    await manager.afterAll();
  });

  describe('createGenericCourse', () => {
    const mutation = gql`
      mutation CreateGenericCourse($data: CreateGenericCourseInput!) {
        createGenericCourse(data: $data) {
          id
          name
        }
      }
    `;

    it('should create a genericGenericCourse', async () => {
      // Arrange
      await populate();

      const variables = {
        data: {
          name: 'Generic Course',
        },
      };

      // Act
      const result = await manager.sendQuery<{ createGenericCourse: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.createGenericCourse).toMatchObject({
        id: expect.any(String),
        name: variables.data.name,
      });
    });
  });

  describe('updateGenericCourse', () => {
    const mutation = gql`
      mutation UpdateGenericCourse($data: UpdateGenericCourseInput!) {
        updateGenericCourse(data: $data) {
          id
          name
        }
      }
    `;

    it('should update a genericGenericCourse', async () => {
      // Arrange
      await populate();

      const genericGenericCourse = await createGenericCourse(manager.prisma);

      const variables = {
        data: {
          id: genericGenericCourse.id,
          name: 'Generic Course',
        },
      };

      // Act
      const result = await manager.sendQuery<{ updateGenericCourse: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.updateGenericCourse).toMatchObject({
        id: genericGenericCourse.id,
        name: variables.data.name,
      });
    });
  });

  describe('deleteGenericCourse', () => {
    const mutation = gql`
      mutation DeleteGenericCourse($id: String!) {
        deleteGenericCourse(id: $id) {
          id
          name
        }
      }
    `;

    it('should delete a genericGenericCourse', async () => {
      // Arrange
      await populate();

      const genericGenericCourse = await createGenericCourse(manager.prisma);

      const variables = {
        id: genericGenericCourse.id,
      };

      // Act
      const result = await manager.sendQuery<{ deleteGenericCourse: unknown }>(
        mutation,
        variables,
      );

      // Assert
      expect(result.data.deleteGenericCourse).toMatchObject({
        id: genericGenericCourse.id,
        name: genericGenericCourse.name,
      });

      const deletedGenericCourse =
        await manager.prisma.genericCourse.findUnique({
          where: { id: genericGenericCourse.id },
        });

      expect(deletedGenericCourse).not.toBeNull();
      expect(deletedGenericCourse?.deleted).toBeTrue();
    });
  });

  describe('getGenericCourse', () => {
    const query = gql`
      query GetGenericCourse($id: String!) {
        getGenericCourse(id: $id) {
          id
          name
        }
      }
    `;

    it('should get a genericGenericCourse', async () => {
      // Arrange
      await populate();

      const genericGenericCourse = genericGenericCourses[0];

      const variables = {
        id: genericGenericCourse.id,
      };

      // Act
      const result = await manager.sendQuery<{ getGenericCourse: unknown }>(
        query,
        variables,
      );

      // Assert
      expect(result.data.getGenericCourse).toMatchObject({
        id: genericGenericCourse.id,
        name: genericGenericCourse.name,
      });
    });
  });

  describe('getGenericCourses', () => {
    const query = gql`
      query GetGenericCourses {
        getGenericCourses {
          id
          name
        }
      }
    `;

    it('should get genericGenericCourses', async () => {
      // Arrange
      await manager.prisma.clearDatabase();
      await populate();

      // Act
      const result = await manager.sendQuery<{ getGenericCourses: unknown }>(
        query,
        {},
      );

      // Assert
      expect(result.data.getGenericCourses).toEqual(
        genericGenericCourses.map((genericGenericCourse) => ({
          id: genericGenericCourse.id,
          name: genericGenericCourse.name,
        })),
      );
    });
  });
});
