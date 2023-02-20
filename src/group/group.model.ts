import { Field, ObjectType } from '@nestjs/graphql';
import { Curriculum } from 'src/curriculum/curriculum.model';

@ObjectType()
export class Group {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Curriculum)
  curriculum: Curriculum;
}
