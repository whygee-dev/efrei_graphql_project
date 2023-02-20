// Generate Campus resolver that calls campus.service.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCampusInput, UpdateCampusInput } from './campus.input';
import { Campus } from './campus.model';
import { CampusService } from './campus.service';

@Resolver(() => Campus)
export class CampusResolver {
  constructor(private readonly campusService: CampusService) {}

  @Query(() => [Campus])
  async getCampuses() {
    return this.campusService.getCampuses();
  }

  @Query(() => Campus)
  async getCampus(@Args('id') id: string) {
    return this.campusService.getCampus(id);
  }

  @Mutation(() => Campus)
  async createCampus(@Args('data') data: CreateCampusInput) {
    return this.campusService.createCampus(data);
  }

  @Mutation(() => Campus)
  async updateCampus(@Args('data') data: UpdateCampusInput) {
    return this.campusService.updateCampus(data);
  }

  @Mutation(() => Campus)
  async deleteCampus(@Args('id') id: string) {
    return this.campusService.deleteCampus(id);
  }
}
