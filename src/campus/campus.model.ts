import { Field, ObjectType } from '@nestjs/graphql';
import { Building } from 'src/building/building.model';
import { Address } from 'src/common/graphql/Address';

@ObjectType()
export class Campus {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Address)
  address: Address;

  @Field(() => [Building])
  buildings: Building[];
}
