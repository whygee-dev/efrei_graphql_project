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

  @Field()
  country: string;
}

@InputType()
export class PartialAddressInput {
  @Field({ nullable: true })
  street?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  zipCode?: string;

  @Field({ nullable: true })
  country?: string;
}
