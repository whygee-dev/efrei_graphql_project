import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  professorId: string;

  @Field()
  genericCourseId: string;
}

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field()
  id: string;
}
