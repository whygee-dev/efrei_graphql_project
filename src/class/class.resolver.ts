import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassService } from './class.service';
import { CreateClassInput, UpdateClassInput } from './class.input';
import { Class } from './class.model';

@Resolver()
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Mutation(() => Class)
  async createClass(@Args('data') course: CreateClassInput) {
    return this.classService.createClass(course);
  }

  @Mutation(() => Class)
  async updateClass(@Args('data') course: UpdateClassInput) {
    return this.classService.updateClass(course);
  }

  @Mutation(() => Class)
  async deleteClass(@Args('id') id: string) {
    return this.classService.deleteClass(id);
  }

  @Query(() => [Class])
  async getClasses() {
    return this.classService.getClasses();
  }

  @Query(() => Class)
  async getClass(@Args('id') id: string) {
    return this.classService.getClass(id);
  }
}
