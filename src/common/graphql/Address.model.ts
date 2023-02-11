import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('AddressInput')
export class Address {
  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  zipCode: string;
}
