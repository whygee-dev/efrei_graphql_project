import {
  Field,
  Float,
  InputType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { IsPositive } from 'class-validator';
import {
  PartialPersonalInfoInput,
  PersonalInfo,
} from 'src/common/graphql/PersonalInfo';

@InputType()
export class CreateProfessorInput {
  @Field(() => PersonalInfo)
  personalInfo: PersonalInfo;

  @Field(() => Float)
  @IsPositive()
  hourlyWage: number;
}

@InputType()
export class UpdateProfessorInput extends PartialType(
  OmitType(CreateProfessorInput, ['personalInfo'] as const),
) {
  @Field()
  id: string;

  @Field(() => PartialPersonalInfoInput, { nullable: true })
  personalInfo?: PartialPersonalInfoInput;
}
