import { Global, Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { PrismaService } from './prisma/prisma.service';
import { CourseModule } from './course/course.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ExamModule } from './exam/exam.module';
import { ProfessorModule } from './professor/professor.module';
import { GroupModule } from './group/group.module';
import { ClassModule } from './class/class.module';
import { ClassroomModule } from './classroom/classroom.module';
import { BuildingModule } from './building/building.module';
import { CampusModule } from './campus/campus.module';

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
    ExamModule,
    ProfessorModule,
    GroupModule,
    ClassModule,
    ClassroomModule,
    BuildingModule,
    CampusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
