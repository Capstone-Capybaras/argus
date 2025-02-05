import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { scenariosTable } from '../../database/schema';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new scenario
  async createScenario(data: CreateScenarioDto) {
    const result = await this.db
      .insert(scenariosTable)
      .values(data)
      .returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all scenarios
  async getScenarios() {
    const scenarios = await this.db.select().from(scenariosTable);
    return scenarios;
  }

  // Retrieve a specific scenario by scenario_number
  async getScenarioByNumber(scenario_number: string) {
    const scenario = await this.db
      .select()
      .from(scenariosTable)
      .where(eq(scenariosTable.scenario_number, scenario_number))
      .limit(1);
    return scenario[0] || null;
  }

  // Update a scenario by scenario_number
  async updateScenario(scenario_number: string, data: UpdateScenarioDto) {
    const result = await this.db
      .update(scenariosTable)
      .set(data)
      .where(eq(scenariosTable.scenario_number, scenario_number))
      .returning();
    return result[0] || null;
  }

  // Delete a scenario by scenario_number
  async deleteScenario(scenario_number: string): Promise<boolean> {
    const result = await this.db
      .delete(scenariosTable)
      .where(eq(scenariosTable.scenario_number, scenario_number))
      .returning();
    return result.length > 0;
  }
}
