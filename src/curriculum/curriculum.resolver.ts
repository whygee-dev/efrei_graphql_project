import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Curriculum } from './curriculum.model';
import { CurriculumService } from './curriculum.service';
import {
  CreateCurriculumInput,
  UpdateCurriculumInput,
} from './curriculum.input';

@Injectable()
@Resolver(() => Curriculum)
export class CurriculumResolver {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Query(() => Curriculum)
  getCurriculum(@Args('id') id: string) {
    return this.curriculumService.getCurriculum(id);
  }

  @Query(() => [Curriculum])
  getCurriculums() {
    return this.curriculumService.getCurriculums();
  }

  @Mutation(() => Curriculum)
  createCurriculum(@Args('data') data: CreateCurriculumInput) {
    return this.curriculumService.createCurriculum(data);
  }

  @Mutation(() => Curriculum)
  updateCurriculum(@Args('data') data: UpdateCurriculumInput) {
    return this.curriculumService.updateCurriculum(data);
  }

  @Mutation(() => Curriculum)
  deleteCurriculum(@Args('id') id: string) {
    return this.curriculumService.deleteCurriculum(id);
  }
}
