import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Curriculum {
  @Field()
  name: string;
}
