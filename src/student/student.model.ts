import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Address } from 'src/common/graphql/Address.model';
import { Curriculum } from 'src/curriculum/curriculum.model';

@ObjectType()
export class Student {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Address)
  address: Address;

  @Field(() => Curriculum)
  curriculum: Curriculum;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
