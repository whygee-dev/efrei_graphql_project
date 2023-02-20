import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateGroupInput {
  @Field()
  name: string;

  @Field()
  curriculumId: string;
}

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @Field()
  id: string;
}
