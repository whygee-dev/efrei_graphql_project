import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Student } from 'src/student/student.model';

@ObjectType()
export class Grade {
  @Field()
  id: string;

  @Field(() => Float)
  grade: number;

  @Field(() => Student)
  student: Student;
}
