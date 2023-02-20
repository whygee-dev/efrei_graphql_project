import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Building } from 'src/building/building.model';
import { Campus } from 'src/campus/campus.model';

@ObjectType()
export class Classroom {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Campus)
  campus: Campus;

  @Field(() => Building)
  building: Building;

  @Field(() => Int)
  floor: number;
}
