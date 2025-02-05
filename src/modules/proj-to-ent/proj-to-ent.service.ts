import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { projectsToEntitiesTable } from 'src/database/schema';
import { CreateProjectToEntityDto } from './dto/create-proj-ent.dto';
import { UpdateProjectToEntityDto } from './dto/update-proj-ent.dto';

@Injectable()
export class ProjToEntService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new project-entity relationship
  async createProjectEntity(data: CreateProjectToEntityDto) {
    const result = await this.db
      .insert(projectsToEntitiesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllProjectEntities() {
    const projectEntitiesList = await this.db
      .select()
      .from(projectsToEntitiesTable);
    return projectEntitiesList;
  }

  async getProjectEntityById(entity_id: number) {
    const projectEntity = await this.db
      .select()
      .from(projectsToEntitiesTable)
      .where(eq(projectsToEntitiesTable.entity_id, entity_id));
    return projectEntity[0];
  }

  async updateProjectEntity(entity_id: number, data: UpdateProjectToEntityDto) {
    const result = await this.db
      .update(projectsToEntitiesTable)
      .set(data)
      .where(eq(projectsToEntitiesTable.entity_id, entity_id))
      .returning();
    return result[0];
  }

  async deleteProjectEntity(entity_id: number): Promise<boolean> {
    const result = await this.db
      .delete(projectsToEntitiesTable)
      .where(eq(projectsToEntitiesTable.entity_id, entity_id))
      .returning();
    return result.length > 0;
  }
}
