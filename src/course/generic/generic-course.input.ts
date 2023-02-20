import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateGenericCourseInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateGenericCourseInput {
  @Field()
  id: string;

  @Field()
  name: string;
}
