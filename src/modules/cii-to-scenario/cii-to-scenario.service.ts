import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CIIToScenariosTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { UpdateCIIScenarioDto } from './dto/update-cii-scenario.dto';
import { CreateCIIScenarioDto } from './dto/create-cii-scenario.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class CiiToScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createCIIScenario(data: CreateCIIScenarioDto) {
    const values = dtoToInsertModel<
      typeof CIIToScenariosTable.$inferInsert,
      CreateCIIScenarioDto
    >(data);
    const result = await this.db
      .insert(CIIToScenariosTable)
      .values(values)
      .returning();
    return result[0];
  }

  async getAllCIIScenario() {
    const ciiList = await this.db.select().from(CIIToScenariosTable);
    return ciiList;
  }

  async getCIIScenarioById(id: number) {
    const cii = await this.db
      .select()
      .from(CIIToScenariosTable)
      .where(eq(CIIToScenariosTable.CII_id, id));
    return cii[0];
  }

  async updateCIIScenario(data: UpdateCIIScenarioDto) {
    const values = dtoToUpdateModel<
      typeof CIIToScenariosTable.$inferInsert,
      UpdateCIIScenarioDto
    >(data);
    const result = await this.db
      .update(CIIToScenariosTable)
      .set(values)
      .where(eq(CIIToScenariosTable.CII_id, data.CII_id))
      .returning();
    return result[0];
  }

  async deleteCIIScenario(id: number): Promise<boolean> {
    const result = await this.db
      .delete(CIIToScenariosTable)
      .where(eq(CIIToScenariosTable.CII_id, id))
      .returning();
    return result.length > 0;
  }
}
