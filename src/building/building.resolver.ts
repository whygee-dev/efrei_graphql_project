// Generate Building resolver that calls building.service.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBuildingInput, UpdateBuildingInput } from './building.input';
import { Building } from './building.model';
import { BuildingService } from './building.service';

@Resolver(() => Building)
export class BuildingResolver {
  constructor(private readonly buildingService: BuildingService) {}

  @Query(() => [Building])
  async getBuildings() {
    return this.buildingService.getBuildings();
  }

  @Query(() => Building)
  async getBuilding(@Args('id') id: string) {
    return this.buildingService.getBuilding(id);
  }

  @Mutation(() => Building)
  async createBuilding(@Args('data') data: CreateBuildingInput) {
    return this.buildingService.createBuilding(data);
  }

  @Mutation(() => Building)
  async updateBuilding(@Args('data') data: UpdateBuildingInput) {
    return this.buildingService.updateBuilding(data);
  }

  @Mutation(() => Building)
  async deleteBuilding(@Args('id') id: string) {
    return this.buildingService.deleteBuilding(id);
  }
}
