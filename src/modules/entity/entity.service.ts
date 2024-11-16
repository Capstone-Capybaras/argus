import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { entitiesTable } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class EntityService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new entity
  async createEntity(data: CreateEntityDto) {
    const values = dtoToInsertModel<
      typeof entitiesTable.$inferInsert,
      CreateEntityDto
    >(data);
    const result = await this.db
      .insert(entitiesTable)
      .values(values)
      .returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all entities
  async getEntities() {
    const entities = await this.db.select().from(entitiesTable);
    return entities;
  }

  // Retrieve a specific entity by name
  async getEntityByName(name: string) {
    const entity = await this.db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.name, name))
      .limit(1);
    return entity[0] || null;
  }

  // Update an entity by name
  async updateEntity(name: string, data: UpdateEntityDto) {
    const values = dtoToUpdateModel<
      typeof entitiesTable.$inferInsert,
      UpdateEntityDto
    >(data);
    const result = await this.db
      .update(entitiesTable)
      .set(values)
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
}
