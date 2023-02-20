import { Injectable } from '@nestjs/common';
import { Mutation, Args, Query } from '@nestjs/graphql';
import { GenericCourse } from './generic-course.model';
import { GenericCourseService } from './generic-course.service';
import {
  CreateGenericCourseInput,
  UpdateGenericCourseInput,
} from './generic-course.input';

@Injectable()
export class GenericCourseResolver {
  constructor(private readonly genericCourseService: GenericCourseService) {}

  @Mutation(() => GenericCourse)
  async createGenericCourse(
    @Args('data') genericCourse: CreateGenericCourseInput,
  ) {
    return this.genericCourseService.createGenericCourse(genericCourse);
  }

  @Mutation(() => GenericCourse)
  async updateGenericCourse(
    @Args('data') genericCourse: UpdateGenericCourseInput,
  ) {
    return this.genericCourseService.updateGenericCourse(genericCourse);
  }

  @Mutation(() => GenericCourse)
  async deleteGenericCourse(@Args('id') id: string) {
    return this.genericCourseService.deleteGenericCourse(id);
  }

  @Query(() => [GenericCourse])
  async getGenericCourses() {
    return this.genericCourseService.getGenericCourses();
  }

  @Query(() => GenericCourse)
  async getGenericCourse(@Args('id') id: string) {
    return this.genericCourseService.getGenericCourse(id);
  }
}
