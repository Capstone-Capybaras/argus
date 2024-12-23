import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { projectsTable } from '../../database/schema'; // Import other tables as needed
import { eq } from 'drizzle-orm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new project
  async createProject(data: CreateProjectDto) {
    const projectData = dtoToInsertModel<
      typeof projectsTable.$inferInsert,
      CreateProjectDto
    >(data);
    const result = await this.db
      .insert(projectsTable)
      .values(projectData)
      .returning();
    return result[0];
  }

  // Retrieve all projects
  async getProjects() {
    const projects = await this.db.select().from(projectsTable);
    return projects;
  }

  // Retrieve a specific project by name
  async getProjectByName(name: string) {
    const project = await this.db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.name, name))
      .limit(1);
    return project[0] || null;
  }

  // Update a project by name
  async updateProject(name: string, data: UpdateProjectDto) {
    const values = dtoToUpdateModel<
      typeof projectsTable.$inferInsert,
      UpdateProjectDto
    >(data);
    const result = await this.db
      .update(projectsTable)
      .set(values)
      .where(eq(projectsTable.name, name))
      .returning();
    return result[0] || null;
  }

  // Delete a project by name
  async deleteProject(name: string): Promise<boolean> {
    const result = await this.db
      .delete(projectsTable)
      .where(eq(projectsTable.name, name))
      .returning();
    return result.length > 0;
  }
}
