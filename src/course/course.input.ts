import { Field, PartialType } from '@nestjs/graphql';

export class CreateCourseInput {
  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  professorId: string;

  @Field()
  genericCourseId: string;
}

export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field()
  id: string;
}
