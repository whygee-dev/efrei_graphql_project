import { Module } from '@nestjs/common';
import { CurriculumResolver } from './curriculum.resolver';
import { CurriculumService } from './curriculum.service';

@Module({
  providers: [CurriculumResolver, CurriculumService],
})
export class CurriculumModule {}
