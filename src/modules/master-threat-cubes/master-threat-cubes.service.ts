import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { masterThreatCubesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateMasterThreatCubeDto } from './dto/create-master-threat.dto';
import { UpdateMasterThreatCubeDto } from './dto/update-master-threat.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class MasterThreatCubesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new master threat cube
  async createMasterThreatCube(data: CreateMasterThreatCubeDto) {
    const values = dtoToInsertModel<
      typeof masterThreatCubesTable.$inferInsert,
      CreateMasterThreatCubeDto
    >(data);
    const result = await this.db
      .insert(masterThreatCubesTable)
      .values(values)
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
      .where(eq(masterThreatCubesTable.id, id));
    return masterThreatCube[0];
  }

  async updateMasterThreatCube(id: string, data: UpdateMasterThreatCubeDto) {
    const values = dtoToUpdateModel<
      typeof masterThreatCubesTable.$inferInsert,
      UpdateMasterThreatCubeDto
    >(data);
    const result = await this.db
      .update(masterThreatCubesTable)
      .set(values)
      .where(eq(masterThreatCubesTable.id, parseInt(id)))
      .returning();
    return result[0];
  }

  async deleteMasterThreatCube(id: number): Promise<boolean> {
    const result = await this.db
      .delete(masterThreatCubesTable)
      .where(eq(masterThreatCubesTable.id, id))
      .returning();
    return result.length > 0;
  }
}
