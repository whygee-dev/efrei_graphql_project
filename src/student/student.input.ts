import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  PartialPersonalInfoInput,
  PersonalInfo,
} from 'src/common/graphql/PersonalInfo';

@InputType()
export class CreateStudentInput {
  @Field(() => PersonalInfo)
  personalInfo: PersonalInfo;

  @Field()
  curriculumId: string;

  @Field()
  groupId: string;
}

@InputType()
export class UpdateStudentInput extends PartialType(
  OmitType(CreateStudentInput, ['personalInfo'] as const),
) {
  @Field()
  id: string;

  @Field(() => PartialPersonalInfoInput, { nullable: true })
  personalInfo?: PartialPersonalInfoInput;
}
