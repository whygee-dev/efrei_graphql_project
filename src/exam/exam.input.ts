import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateExamInput {
  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  courseId: string;
}

@InputType()
export class UpdateExamInput extends PartialType(CreateExamInput) {
  @Field()
  id: string;
}

@InputType()
export class GradeExamInput {
  @Field()
  id: string;

  @Field()
  grade: number;

  @Field()
  studentId: string;
}
