import { Field, ObjectType } from '@nestjs/graphql';
import { Campus } from 'src/campus/campus.model';

@ObjectType()
export class Building {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Campus)
  campus: Campus;
}
