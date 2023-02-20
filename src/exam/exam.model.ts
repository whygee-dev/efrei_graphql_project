import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Course } from 'src/course/course.model';

@ObjectType()
export class Exam {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field(() => Course)
  course: Course;
}
