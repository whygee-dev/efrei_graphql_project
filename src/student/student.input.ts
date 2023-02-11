import {
  Field,
  GraphQLISODateTime,
  InputType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Address } from 'src/common/graphql/Address.model';

@InputType()
export class CreateStudentInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => GraphQLISODateTime)
  birthDate: Date;

  @Field(() => Address)
  address: Address;

  @Field()
  curriculumId: string;
}

@InputType()
export class UpdateStudentInput extends OmitType(
  PartialType(CreateStudentInput),
  ['curriculumId'] as const,
) {
  @Field()
  id: string;
}
