import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingResolver } from './building.resolver';

@Module({
  providers: [BuildingService, BuildingResolver],
})
export class BuildingModule {}
