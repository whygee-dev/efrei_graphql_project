import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Exam } from './exam.model';
import { ExamService } from './exam.service';
import { CreateExamInput, UpdateExamInput } from './exam.input';

@Resolver()
export class ExamResolver {
  constructor(private readonly examService: ExamService) {}

  @Query(() => Exam)
  getExam(@Args('id', { type: () => String }) id: string) {
    return this.examService.getExam(id);
  }

  @Mutation(() => Exam)
  createExam(@Args('data') data: CreateExamInput) {
    return this.examService.createExam(data);
  }

  @Mutation(() => Exam)
  updateExam(@Args('data') data: UpdateExamInput) {
    return this.examService.updateExam(data);
  }

  @Mutation(() => Exam)
  deleteExam(@Args('id') id: string) {
    return this.examService.deleteExam(id);
  }

  @Query(() => [Exam])
  getExamsByCourse(@Args('courseId') courseId: string) {
    return this.examService.getExamsByCourse(courseId);
  }
}
