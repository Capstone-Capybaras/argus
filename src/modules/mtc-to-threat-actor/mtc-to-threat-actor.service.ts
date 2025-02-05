import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { masterThreatCubesToThreatActorsTable } from 'src/database/schema';
import { CreateMasterThreatCubesToThreatActorsDto } from './dto/create-mtc-ta.dto';
import { UpdateMasterThreatCubesToThreatActorsDto } from './dto/update-mtc-ta.dto';

@Injectable()
export class MtcToThreatActorService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createMTCToTA(data: CreateMasterThreatCubesToThreatActorsDto) {
    const result = await this.db
      .insert(masterThreatCubesToThreatActorsTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllMTCToTA() {
    const mtcToTAList = await this.db
      .select()
      .from(masterThreatCubesToThreatActorsTable);
    return mtcToTAList;
  }

  async getMTCToTAById(id: number) {
    const mtcToTA = await this.db
      .select()
      .from(masterThreatCubesToThreatActorsTable)
      .where(eq(masterThreatCubesToThreatActorsTable.threat_cube_id, id));
    return mtcToTA[0];
  }

  async updateMTCToTA(
    id: string,
    data: UpdateMasterThreatCubesToThreatActorsDto,
  ) {
    const result = await this.db
      .update(masterThreatCubesToThreatActorsTable)
      .set(data)
      .where(
        eq(masterThreatCubesToThreatActorsTable.threat_cube_id, parseInt(id)),
      )
      .returning();
    return result[0];
  }

  async deleteMTCToTA(id: number): Promise<boolean> {
    const result = await this.db
      .delete(masterThreatCubesToThreatActorsTable)
      .where(eq(masterThreatCubesToThreatActorsTable.threat_cube_id, id))
      .returning();
    return result.length > 0;
  }
}
