import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Curriculum } from '../curriculum/curriculum.model';
import { Group } from 'src/group/group.model';
import { PersonalInfo } from 'src/common/graphql/PersonalInfo';

@ObjectType()
export class Student {
  @Field()
  id: string;

  @Field(() => PersonalInfo)
  personalInfo: PersonalInfo;

  @Field(() => Curriculum)
  curriculum: Curriculum;

  @Field(() => Group)
  group: Group;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
