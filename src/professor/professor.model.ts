import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Curriculum } from '../curriculum/curriculum.model';
import { PersonalInfo } from 'src/common/graphql/PersonalInfo';

@ObjectType()
export class Professor {
  @Field()
  id: string;

  @Field(() => PersonalInfo)
  personalInfo: PersonalInfo;

  @Field(() => Curriculum)
  curriculum: Curriculum;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Float)
  hourlyWage: number;
}
