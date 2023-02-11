import { Global, Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { PrismaService } from './prisma/prisma.service';
import { CourseModule } from './course/course.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class GlobalModule {}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: './graphql/schema.gql',
    }),
    GlobalModule,
    StudentModule,
    CourseModule,
    CurriculumModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
