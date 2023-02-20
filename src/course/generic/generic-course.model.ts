import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenericCourse {
  @Field()
  id: string;

  @Field()
  name: string;
}
