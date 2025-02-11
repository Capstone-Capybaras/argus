import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { masterThreatCubesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateMasterThreatCubeDto } from './dto/create-master-threat.dto';
import { UpdateMasterThreatCubeDto } from './dto/update-master-threat.dto';

@Injectable()
export class MasterThreatCubesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new master threat cube
  async createMasterThreatCube(data: CreateMasterThreatCubeDto) {
    const result = await this.db
      .insert(masterThreatCubesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllMasterThreatCubes() {
    const masterThreatCubesList = await this.db
      .select()
      .from(masterThreatCubesTable);
    return masterThreatCubesList;
  }

  async getMasterThreatCubeById(id: number) {
    const masterThreatCube = await this.db
      .select()
      .from(masterThreatCubesTable)
      .where(eq(masterThreatCubesTable.threat_cube_id, id));
    return masterThreatCube[0];
  }

  async updateMasterThreatCube(id: number, data: UpdateMasterThreatCubeDto) {
    const result = await this.db
      .update(masterThreatCubesTable)
      .set(data)
      .where(eq(masterThreatCubesTable.threat_cube_id, id))
      .returning();
    return result[0];
  }

  async deleteMasterThreatCube(id: number): Promise<boolean> {
    const result = await this.db
      .delete(masterThreatCubesTable)
      .where(eq(masterThreatCubesTable.threat_cube_id, id))
      .returning();
    return result.length > 0;
  }
}
