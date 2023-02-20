import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomResolver } from './classroom.resolver';

@Module({
  providers: [ClassroomService, ClassroomResolver],
})
export class ClassroomModule {}
