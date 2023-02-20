import { Field, ObjectType } from '@nestjs/graphql';
import { GenericCourse } from './generic/generic-course.model';
import { Professor } from 'src/professor/professor.model';

@ObjectType()
export class Course {
  @Field()
  id: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => Professor)
  professor: Professor;

  @Field(() => GenericCourse)
  genericCourse: GenericCourse;
}
