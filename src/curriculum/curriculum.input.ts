import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCurriculumInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateCurriculumInput {
  @Field()
  id: string;

  @Field()
  name: string;
}
