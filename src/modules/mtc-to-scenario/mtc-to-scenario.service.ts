import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { masterThreatCubesToScenariosTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateMasterThreatToScenarioDto } from './dto/create-mtc-scen.dto';
import { UpdateMasterThreatToScenarioDto } from './dto/update-mtc-scen.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class MtcToScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createMasterThreatToScenario(data: CreateMasterThreatToScenarioDto) {
    const values = dtoToInsertModel<
      typeof masterThreatCubesToScenariosTable.$inferInsert,
      CreateMasterThreatToScenarioDto
    >(data);
    const result = await this.db
      .insert(masterThreatCubesToScenariosTable)
      .values(values)
      .returning();
    return result[0];
  }

  async getAllMasterThreatToScenario() {
    const masterThreatToScenarioList = await this.db
      .select()
      .from(masterThreatCubesToScenariosTable);
    return masterThreatToScenarioList;
  }

  async getMasterThreatToScenarioById(id: number) {
    const masterThreatToScenario = await this.db
      .select()
      .from(masterThreatCubesToScenariosTable)
      .where(eq(masterThreatCubesToScenariosTable.threat_cube_id, id));
    return masterThreatToScenario[0];
  }

  async updateMasterThreatToScenario(
    id: string,
    data: UpdateMasterThreatToScenarioDto,
  ) {
    const values = dtoToUpdateModel<
      typeof masterThreatCubesToScenariosTable.$inferInsert,
      UpdateMasterThreatToScenarioDto
    >(data);
    const result = await this.db
      .update(masterThreatCubesToScenariosTable)
      .set(values)
      .where(eq(masterThreatCubesToScenariosTable.threat_cube_id, parseInt(id)))
      .returning();
    return result[0];
  }

  async deleteMasterThreatToScenario(id: number): Promise<boolean> {
    const result = await this.db
      .delete(masterThreatCubesToScenariosTable)
      .where(eq(masterThreatCubesToScenariosTable.threat_cube_id, id))
      .returning();
    return result.length > 0;
  }
}
