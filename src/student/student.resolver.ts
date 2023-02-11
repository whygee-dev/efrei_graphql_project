import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Student } from './student.model';
import { StudentService } from './student.service';
import { CreateStudentInput, UpdateStudentInput } from './student.input';

@Resolver()
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => Student)
  getStudent(@Args('id', { type: () => String }) id: string) {
    return this.studentService.getStudent(id);
  }

  @Query(() => [Student])
  getStudents() {
    return this.studentService.getStudents();
  }

  @Mutation(() => Student)
  createStudent(@Args('data') data: CreateStudentInput) {
    return this.studentService.createStudent(data);
  }

  @Mutation(() => Student)
  updateStudent(@Args('data') data: UpdateStudentInput) {
    return this.studentService.updateStudent(data);
  }
}
