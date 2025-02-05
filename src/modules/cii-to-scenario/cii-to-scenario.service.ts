import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CIIToScenariosTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { UpdateCIIScenarioDto } from './dto/update-cii-scenario.dto';
import { CreateCIIScenarioDto } from './dto/create-cii-scenario.dto';

@Injectable()
export class CiiToScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createCIIScenario(data: CreateCIIScenarioDto) {
    const result = await this.db
      .insert(CIIToScenariosTable)
      .values(data)
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
    const result = await this.db
      .update(CIIToScenariosTable)
      .set(data)
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
