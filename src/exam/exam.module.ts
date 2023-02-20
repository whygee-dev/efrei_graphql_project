import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamResolver } from './exam.resolver';

@Module({
  providers: [ExamService, ExamResolver],
})
export class ExamModule {}
