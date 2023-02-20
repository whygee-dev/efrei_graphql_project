import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreateClassroomInput {
  @Field()
  name: string;

  @Field()
  buildingId: string;

  @Field()
  campusId: string;

  @Field(() => Int)
  @Min(0)
  floor: number;
}

@InputType()
export class UpdateClassroomInput extends PartialType(CreateClassroomInput) {
  @Field()
  id: string;
}
