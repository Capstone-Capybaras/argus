import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { scenariosTable } from '../../database/schema';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { eq } from 'drizzle-orm';
import { GenerateScenarioDto } from './dto/generate-scenario.dto';
import { EntityService } from '../entity/entity.service';
import { AssetsService } from '../assets/assets.service';
import { JobsService } from '../jobs/jobs.service';
import { GenerateScenarioCallbackDto } from './dto/generate-scenario-callback.dto';

@Injectable()
export class ScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly entityService: EntityService,
    private readonly assetService: AssetsService,
    private readonly jobsService: JobsService,
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

  async generateScenario(generateScenarioDto: GenerateScenarioDto) {
    // get all required info for generation
    const entity = await this.entityService.getEntityById(
      generateScenarioDto.entity_id,
    );

    if (!entity) {
      throw new Error('Could not find entity by ID when generating scenario');
    }
    const asset = await this.assetService.getAssetById(
      generateScenarioDto.asset_id,
    );
    if (!asset) {
      throw new Error('Could not find asset by ID when generating scenario');
    }

    // create job and return it
    const job = await this.jobsService.createJob({
      type: 'scenario',
      status: 'pending',
      name: generateScenarioDto.job_name,
    });

    // TODO: if job is successfully inserted, send to ML

    return job;
  }

  async generateScenarioCallback(
    generateScenarioCompleted: GenerateScenarioCallbackDto,
  ) {}
}
