import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateBuildingInput {
  @Field()
  name: string;

  @Field()
  campusId: string;
}

@InputType()
export class UpdateBuildingInput extends PartialType(CreateBuildingInput) {
  @Field()
  id: string;
}
