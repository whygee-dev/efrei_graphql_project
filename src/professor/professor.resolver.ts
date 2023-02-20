import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Professor } from './professor.model';
import { ProfessorService } from './professor.service';
import { CreateProfessorInput, UpdateProfessorInput } from './professor.input';

@Resolver()
export class ProfessorResolver {
  constructor(private readonly professorService: ProfessorService) {}

  @Query(() => Professor)
  getProfessor(@Args('id', { type: () => String }) id: string) {
    return this.professorService.getProfessor(id);
  }

  @Query(() => [Professor])
  getProfessors() {
    return this.professorService.getProfessors();
  }

  @Mutation(() => Professor)
  createProfessor(@Args('data') data: CreateProfessorInput) {
    return this.professorService.createProfessor(data);
  }

  @Mutation(() => Professor)
  updateProfessor(@Args('data') data: UpdateProfessorInput) {
    return this.professorService.updateProfessor(data);
  }

  @Mutation(() => Professor)
  deleteProfessor(@Args('id', { type: () => String }) id: string) {
    return this.professorService.deleteProfessor(id);
  }
}
