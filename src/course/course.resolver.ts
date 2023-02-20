import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { CreateCourseInput, UpdateCourseInput } from './course.input';
import { Course } from './course.model';

@Injectable()
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  async createCourse(@Args('data') course: CreateCourseInput) {
    return this.courseService.createCourse(course);
  }

  @Mutation(() => Course)
  async updateCourse(@Args('data') course: UpdateCourseInput) {
    return this.courseService.updateCourse(course);
  }

  @Mutation(() => Course)
  async deleteCourse(@Args('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Query(() => [Course])
  async getCourses() {
    return this.courseService.getCourses();
  }

  @Query(() => Course)
  async getCourse(@Args('id') id: string) {
    return this.courseService.getCourse(id);
  }
}
