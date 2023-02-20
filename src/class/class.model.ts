import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classroom/classroom.model';
import { Course } from 'src/course/course.model';
import { Professor } from 'src/professor/professor.model';

@ObjectType()
export class Class {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => Course)
  course: Course;

  @Field(() => Professor)
  professor: Professor;

  @Field(() => Classroom)
  classroom: Classroom;
}
