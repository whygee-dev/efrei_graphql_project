import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Group } from './group.model';
import { CreateGroupInput, UpdateGroupInput } from './group.input';
import { GroupService } from './group.service';

@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

  @Query(() => Group)
  getGroup(@Args('id') id: string) {
    return this.groupService.getGroup(id);
  }

  @Query(() => [Group])
  getGroups() {
    return this.groupService.getGroups();
  }

  @Mutation(() => Group)
  createGroup(@Args('data') data: CreateGroupInput) {
    return this.groupService.createGroup(data);
  }

  @Mutation(() => Group)
  updateGroup(@Args('data') data: UpdateGroupInput) {
    return this.groupService.updateGroup(data);
  }

  @Mutation(() => Group)
  deleteGroup(@Args('id') id: string) {
    return this.groupService.deleteGroup(id);
  }
}
