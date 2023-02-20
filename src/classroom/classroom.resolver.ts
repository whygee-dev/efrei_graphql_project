import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassroomService } from './classroom.service';
import { CreateClassroomInput, UpdateClassroomInput } from './classroom.input';
import { Classroom } from './classroom.model';

@Resolver()
export class ClassroomResolver {
  constructor(private readonly classroomService: ClassroomService) {}

  @Mutation(() => Classroom)
  async createClassroom(@Args('data') course: CreateClassroomInput) {
    return this.classroomService.createClassroom(course);
  }

  @Mutation(() => Classroom)
  async updateClassroom(@Args('data') course: UpdateClassroomInput) {
    return this.classroomService.updateClassroom(course);
  }

  @Mutation(() => Classroom)
  async deleteClassroom(@Args('id') id: string) {
    return this.classroomService.deleteClassroom(id);
  }

  @Query(() => [Classroom])
  async getClassrooms() {
    return this.classroomService.getClassrooms();
  }

  @Query(() => Classroom)
  async getClassroom(@Args('id') id: string) {
    return this.classroomService.getClassroom(id);
  }
}
