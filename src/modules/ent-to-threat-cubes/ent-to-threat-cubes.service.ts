import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { entitiesToThreatCubesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateEntToThreatDto } from './dto/create-ent-to-threat.dto';
import { UpdateEntToThreatDto } from './dto/update-ent-to-threat.dto';

@Injectable()
export class EntToThreatCubesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createEntToThreat(data: CreateEntToThreatDto) {
    const result = await this.db
      .insert(entitiesToThreatCubesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllEntToThreat() {
    const entToThreatList = await this.db
      .select()
      .from(entitiesToThreatCubesTable);
    return entToThreatList;
  }

  async getEntToThreatById(id: number) {
    const entToThreat = await this.db
      .select()
      .from(entitiesToThreatCubesTable)
      .where(eq(entitiesToThreatCubesTable.entity_id, id));
    return entToThreat[0];
  }

  async updateEntToThreat(id: number, data: UpdateEntToThreatDto) {
    const result = await this.db
      .update(entitiesToThreatCubesTable)
      .set(data)
      .where(eq(entitiesToThreatCubesTable.entity_id, id))
      .returning();
    return result[0];
  }

  async deleteEntToThreat(id: number): Promise<boolean> {
    const result = await this.db
      .delete(entitiesToThreatCubesTable)
      .where(eq(entitiesToThreatCubesTable.entity_id, id))
      .returning();
    return result.length > 0;
  }
}
