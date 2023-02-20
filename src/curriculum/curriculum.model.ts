import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Curriculum {
  @Field()
  id: string;

  @Field()
  name: string;
}
