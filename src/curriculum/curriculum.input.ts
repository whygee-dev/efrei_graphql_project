import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateCurriculum {
  name: string;
}
