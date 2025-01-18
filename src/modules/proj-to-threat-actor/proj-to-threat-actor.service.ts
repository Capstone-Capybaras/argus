import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { projectsToThreatActorsTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateProjectToThreatActorDto } from './dto/create-proj-actor.dto';
import { UpdateProjectToThreatActorDto } from './dto/update-proj-actor.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class ProjToThreatActorService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new project to threat actor
  async createProjectToThreatActor(data: CreateProjectToThreatActorDto) {
    const values = dtoToInsertModel<
      typeof projectsToThreatActorsTable.$inferInsert,
      CreateProjectToThreatActorDto
    >(data);
    const result = await this.db
      .insert(projectsToThreatActorsTable)
      .values(values)
      .returning();
    return result[0];
  }

  async getAllProjectToThreatActor() {
    const projectToThreatActorList = await this.db
      .select()
      .from(projectsToThreatActorsTable);
    return projectToThreatActorList;
  }

  async getProjectToThreatActorById(project_id: number) {
    const projectToThreatActor = await this.db
      .select()
      .from(projectsToThreatActorsTable)
      .where(eq(projectsToThreatActorsTable.project_id, project_id));
    return projectToThreatActor[0];
  }

  async updateProjectToThreatActor(
    project_id: number,
    data: UpdateProjectToThreatActorDto,
  ) {
    const values = dtoToUpdateModel<
      typeof projectsToThreatActorsTable.$inferInsert,
      UpdateProjectToThreatActorDto
    >(data);
    const result = await this.db
      .update(projectsToThreatActorsTable)
      .set(values)
      .where(eq(projectsToThreatActorsTable.project_id, project_id))
      .returning();
    return result[0];
  }

  async deleteProjectToThreatActor(project_id: number): Promise<boolean> {
    const result = await this.db
      .delete(projectsToThreatActorsTable)
      .where(eq(projectsToThreatActorsTable.project_id, project_id))
      .returning();
    return result.length > 0;
  }
}
