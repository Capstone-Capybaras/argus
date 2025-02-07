import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  CIITable,
  entitiesTable,
  participantsTable,
  projectsTable,
  projectsToEntitiesTable,
} from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { AssignEntityDto } from './dto/assign-entity.dto';

@Injectable()
export class EntityService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new entity
  async createEntity(data: CreateEntityDto) {
    const result = await this.db.insert(entitiesTable).values(data).returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all entities
  async getEntities() {
    const entities = await this.db.select().from(entitiesTable);
    return entities;
  }

  async getEntitiesByProjectId(projectId: number) {
    const results = await this.db
      .select()
      .from(projectsToEntitiesTable)
      .leftJoin(
        projectsTable,
        eq(projectsToEntitiesTable.project_id, projectsTable.id),
      )
      .leftJoin(
        entitiesTable,
        eq(projectsToEntitiesTable.entity_id, entitiesTable.id),
      )
      .where(eq(projectsTable.id, projectId));
    return results.map((res) => res.entities).filter((res) => !!res);
  }

  // Retrieve a specific entity by id
  async getEntityById(id: number) {
    const results = await this.db
      .select()
      .from(entitiesTable)
      .leftJoin(
        participantsTable,
        eq(entitiesTable.id, participantsTable.entity_id),
      )
      .leftJoin(CIITable, eq(entitiesTable.id, CIITable.entity_id))
      .where(eq(entitiesTable.id, id));

    if (results.length === 0) return null;

    const entityInfo = results[0].entities;
    const participants = results
      .map((item) => item.participants)
      .filter((p) => !!p);
    const cii = results.map((item) => item.CII).filter((c) => !!c);

    return {
      ...entityInfo,
      participants,
      cii,
    };
  }

  // Update an entity by name
  async updateEntity(name: string, data: UpdateEntityDto) {
    const result = await this.db
      .update(entitiesTable)
      .set(data)
      .where(eq(entitiesTable.name, name))
      .returning();
    return result[0] || null;
  }

  // Delete an entity by name
  async deleteEntity(name: string): Promise<boolean> {
    const result = await this.db
      .delete(entitiesTable)
      .where(eq(entitiesTable.name, name))
      .returning();
    return result.length > 0;
  }

  async assignEntityToProject(data: AssignEntityDto) {
    // just add to join table
    const result = await this.db
      .insert(projectsToEntitiesTable)
      .values(data)
      .returning();

    if (result.length === 0) return null;
    return result[0];
  }
}
