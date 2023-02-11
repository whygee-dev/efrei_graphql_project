import { Injectable } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Curriculum } from './curriculum.model';
import { CurriculumService } from './curriculum.service';

@Injectable()
@Resolver(() => Curriculum)
export class CurriculumResolver {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Query(() => [Curriculum])
  getCurriculums() {
    return this.curriculumService.getCurriculums();
  }
}
