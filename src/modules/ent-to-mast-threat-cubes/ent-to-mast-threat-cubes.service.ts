import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { entitiesToMasterThreatCubesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateEntToMasterThreatCubes } from './dto/create-ent-to-mast.dto';
import { UpdateEntToMasterThreatCubes } from './dto/update-ent-to-mast.dto';

@Injectable()
export class EntToMastThreatCubesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createEntToMastThreatCube(data: CreateEntToMasterThreatCubes) {
    const result = await this.db
      .insert(entitiesToMasterThreatCubesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllEntToMastThreatCubes() {
    const entToMastThreatCubesList = await this.db
      .select()
      .from(entitiesToMasterThreatCubesTable);
    return entToMastThreatCubesList;
  }

  async getEntToMastThreatCubesById(entity_id: number) {
    const entToMastThreatCubes = await this.db
      .select()
      .from(entitiesToMasterThreatCubesTable)
      .where(eq(entitiesToMasterThreatCubesTable.entity_id, entity_id));
    return entToMastThreatCubes[0];
  }

  async updateEntToMastThreatCubes(
    entity_id: number,
    data: UpdateEntToMasterThreatCubes,
  ) {
    const result = await this.db
      .update(entitiesToMasterThreatCubesTable)
      .set(data)
      .where(eq(entitiesToMasterThreatCubesTable.entity_id, entity_id))
      .returning();
    return result[0];
  }

  async deleteEntToMastThreatCubes(entity_id: number): Promise<boolean> {
    const result = await this.db
      .delete(entitiesToMasterThreatCubesTable)
      .where(eq(entitiesToMasterThreatCubesTable.entity_id, entity_id))
      .returning();
    return result.length > 0;
  }
}
