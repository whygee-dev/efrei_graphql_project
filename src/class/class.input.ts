import {
  Field,
  GraphQLISODateTime,
  InputType,
  PartialType,
} from '@nestjs/graphql';

@InputType()
export class CreateClassInput {
  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field()
  courseId: string;

  @Field()
  professorId: string;

  @Field()
  classroomId: string;
}

@InputType()
export class UpdateClassInput extends PartialType(CreateClassInput) {
  @Field()
  id: string;
}
