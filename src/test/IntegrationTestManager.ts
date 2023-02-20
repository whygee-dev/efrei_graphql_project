import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request, { SuperTestExecutionResult } from 'supertest-graphql';
import { DocumentNode } from 'graphql';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

export class IntegrationTestManager {
  private module: TestingModule;
  private app: INestApplication;
  public httpServer: unknown;
  public prisma: PrismaService;

  async beforeAll(): Promise<void> {
    this.module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.module.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
    await this.app.init();

    this.httpServer = this.app.getHttpServer();
    this.prisma = this.app.get<PrismaService>(PrismaService);
  }

  async afterAll() {
    await this.app.close();
    await this.prisma.clearDatabase();
  }

  async sendQuery<T>(
    query: DocumentNode,
    variables: Record<string, unknown>,
    expectedNoError = true,
  ): Promise<SuperTestExecutionResult<T>> {
    const req = request<T>(this.httpServer).query(query).variables(variables);

    return expectedNoError ? await req.expectNoErrors() : await req;
  }
}
