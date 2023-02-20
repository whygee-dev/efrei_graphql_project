import { Module } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CampusResolver } from './campus.resolver';

@Module({
  providers: [CampusService, CampusResolver],
})
export class CampusModule {}
