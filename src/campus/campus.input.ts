import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Address, PartialAddressInput } from 'src/common/graphql/Address';

@InputType()
export class CreateCampusInput {
  @Field()
  name: string;

  @Field(() => Address)
  address: Address;
}

@InputType()
export class UpdateCampusInput extends PartialType(
  OmitType(CreateCampusInput, ['address']),
) {
  @Field()
  id: string;

  @Field(() => PartialAddressInput, { nullable: true })
  address?: PartialAddressInput;
}
