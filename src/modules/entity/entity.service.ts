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
import {
  SelectEntityDto,
  SelectEntityOnlyDto,
  SelectEntityWithAssetSimpleDto,
} from './dto/select-entity.dto';
import { DeepSet } from 'src/utils/DeepSet';
import { ParticipantsService } from '../participants/participants.service';
import { SelectAssetDto } from '../assets/dto/select-asset.dto';
import { AssetsService } from '../assets/assets.service';
import { omit } from 'lodash';

class ISelectEntity extends SelectEntityOnlyDto {
  assets: DeepSet<SelectAssetDto>;
}

@Injectable()
export class EntityService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly participantsService: ParticipantsService,
    private readonly assetsService: AssetsService,
  ) {}

  // Create a new entity
  async createEntity(data: CreateEntityDto) {
    const { project_id, ...entity } = data;
    return this.db.transaction(async (tx) => {
      // first insert the entity itself
      const [createdEntity] = await tx
        .insert(entitiesTable)
        .values(entity)
        .returning();
      // then add to join table
      await tx.insert(projectsToEntitiesTable).values({
        project_id,
        entity_id: createdEntity.id,
      });

      return createdEntity;
    });
  }

  // Retrieve all entities
  async getEntities() {
    const entities = await this.db.select().from(entitiesTable);
    return entities;
  }

  // function signature overloading
  async getEntitiesByProjectId(args: {
    projectId: number;
    withAssets: true;
  }): Promise<SelectEntityWithAssetSimpleDto[]>;

  async getEntitiesByProjectId(args: {
    projectId: number;
    withAssets?: false;
  }): Promise<SelectEntityOnlyDto[]>;

  async getEntitiesByProjectId({
    projectId,
    withAssets = false,
  }: {
    projectId: number;
    withAssets?: boolean;
  }) {
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

    const entities = results.map((res) => res.entities).filter((res) => !!res);
    if (!withAssets) return entities;

    const entitiesWithAssets = await Promise.all(
      entities.map<Promise<SelectEntityWithAssetSimpleDto>>(async (entity) => {
        const assets = await this.db
          .select({
            id: assetsTable.id,
            name: assetsTable.name,
          })
          .from(assetsTable)
          .where(eq(assetsTable.entity_id, entity.id));

        return {
          id: entity.id,
          name: entity.name,
          assets,
        };
      }),
    );

    return entitiesWithAssets;
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

  async getPlainEntityById(id: number): Promise<SelectEntityOnlyDto> {
    const [entity] = await this.db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, id));
    return entity;
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
    const originalEntity = await this.db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, data.entity_id))
      .limit(1);

    if (originalEntity.length === 0) {
      return null;
    }

    const entityToDuplicate = originalEntity[0];
    const assetsToDuplicate = await this.assetsService.duplicateAssets(
      data.entity_id,
    );

    return this.db.transaction(async (tx) => {
      // 1) insert the newly duped entity
      const [newEntity] = await tx
        .insert(entitiesTable)
        .values({
          name: entityToDuplicate.name,
          description: entityToDuplicate.description,
          victim_sector: entityToDuplicate.victim_sector,
          critical_function: entityToDuplicate.critical_function,
          policy_documents: entityToDuplicate.policy_documents,
          severity_levels: entityToDuplicate.severity_levels,
        })
        .returning();

      // 2) add to join table
      await tx.insert(projectsToEntitiesTable).values({
        project_id: data.project_id,
        entity_id: newEntity.id,
      });

      // 3) create assets to duplicate
      if (assetsToDuplicate.length > 0) {
        await tx
          .insert(assetsTable)
          .values(
            assetsToDuplicate.map((asset) => ({
              ...omit(asset, 'id'),
              entity_id: newEntity.id, // Associate with the new entity
            })),
          )
          .returning();
      }

      return newEntity;
    });
  }
}
