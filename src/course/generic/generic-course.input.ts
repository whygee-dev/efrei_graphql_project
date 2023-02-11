import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateGenericCourse {
  @Field()
  name: string;
}
