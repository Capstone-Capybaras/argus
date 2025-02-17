import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  assetsTable,
  entitiesTable,
  projectsTable,
  projectsToEntitiesTable,
} from '../../database/schema';
import { eq, not, inArray } from 'drizzle-orm';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { AssignEntityDto } from './dto/assign-entity.dto';
import { SelectEntityDto, SelectEntityOnlyDto } from './dto/select-entity.dto';
import { DeepSet } from 'src/utils/DeepSet';
import { ParticipantsService } from '../participants/participants.service';
import { SelectAssetDto } from '../assets/dto/select-asset.dto';

class ISelectEntity extends SelectEntityOnlyDto {
  assets: DeepSet<SelectAssetDto>;
}

@Injectable()
export class EntityService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly participantsService: ParticipantsService,
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

  async getUnassignedEntitiesByProjectId(projectId: number) {
    // Get entity IDs that are already assigned to specified project
    const assignedEntities = await this.db
      .select({ entity_id: projectsToEntitiesTable.entity_id })
      .from(projectsToEntitiesTable)
      .where(eq(projectsToEntitiesTable.project_id, projectId));

    const assignedEntityIds = assignedEntities.map((row) => row.entity_id);

    // Query entities that are not in the assignedEntityIds
    const unassignedEntities = await this.db
      .select()
      .from(entitiesTable)
      .where(not(inArray(entitiesTable.id, assignedEntityIds)));

    return unassignedEntities;
  }

  // Retrieve a specific entity by id
  async getEntityById(id: number): Promise<SelectEntityDto | null> {
    const entityParticipants =
      await this.participantsService.getAllParticipantsByEntity(id);

    const rows = await this.db
      .select({
        entity: entitiesTable,
        asset: assetsTable,
      })
      .from(entitiesTable)
      .leftJoin(assetsTable, eq(entitiesTable.id, assetsTable.entity_id))
      .where(eq(entitiesTable.id, id));

    if (rows.length === 0) return null;

    const results = rows.reduce<ISelectEntity>((acc, row) => {
      const { entity, asset } = row;

      if (!acc.id) {
        acc = { ...entity, assets: new DeepSet() };
      }

      if (asset) {
        acc.assets.add(asset);
      }

      return acc;
    }, {} as ISelectEntity);

    return {
      ...results,
      participants: entityParticipants,
      assets: Array.from(results.assets),
    };
  }

  // Update an entity by name
  async updateEntity(id: number, data: UpdateEntityDto) {
    const result = await this.db
      .update(entitiesTable)
      .set(data)
      .where(eq(entitiesTable.id, id))
      .returning();
    return result[0] || null;
  }

  // Delete an entity by id
  async deleteEntity(id: number): Promise<boolean> {
    const result = await this.db
      .delete(entitiesTable)
      .where(eq(entitiesTable.id, id))
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

    const entity = await this.db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, data.entity_id))
      .limit(1);

    return entity.length > 0 ? entity[0] : null;
  }
}
