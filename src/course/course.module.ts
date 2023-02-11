import { Module } from '@nestjs/common';
import { CourseResolver } from './course.resolver';
import { GenericCourseResolver } from './generic/generic-course.resolver';
import { GenericCourseService } from './generic/generic-course.service';
import { CourseService } from './course.service';

@Module({
  providers: [
    CourseService,
    CourseResolver,
    GenericCourseResolver,
    GenericCourseService,
  ],
})
export class CourseModule {}
