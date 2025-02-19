import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  jobsTable,
  scenariosGeneratedTable,
  scenariosTable,
} from '../../database/schema';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { eq } from 'drizzle-orm';
import { GenerateScenarioDto } from './dto/generate-scenario.dto';
import { EntityService } from '../entity/entity.service';
import { AssetsService } from '../assets/assets.service';
import { JobsService } from '../jobs/jobs.service';
import { GenerateScenarioCallbackDto } from './dto/generate-scenario-callback.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly entityService: EntityService,
    private readonly assetService: AssetsService,
    private readonly jobsService: JobsService,
    private readonly eventsGateway: EventsGateway,
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

    const { participants, assets, ...entityInfo } = entity;
    const generationInputs = {
      entity: entityInfo,
      asset,
    };

    // create job and return it
    const job = await this.db.transaction(async (tx) => {
      // insert record into generated table
      await this.db.insert(scenariosGeneratedTable).values({
        scenario_number: generateScenarioDto.scenario_number,
        project_id: generateScenarioDto.project_id,
        asset_id: generateScenarioDto.asset_id,
        generation_inputs: generationInputs,
      });

      // create job
      const createdJob = await this.jobsService.createJob({
        type: 'scenario',
        status: 'pending',
        name: generateScenarioDto.scenario_number,
      });

      return createdJob;
    });

    // TODO: if job is successfully inserted, send to ML
    // should send scenario_number and project_id as well, as this is the PK

    return job;
  }

  async generateScenarioCallback(data: GenerateScenarioCallbackDto) {
    const { job_status, job_id, scenario: scenarioData } = data;

    if (job_status === 'pending') return;

    if (job_status === 'failed') {
      await this.jobsService.updateJob({
        id: job_id,
        status: job_status,
      });

      // send websocket that job failed
      this.eventsGateway.onScenarioJobFailed({
        jobId: job_id,
      });

      return;
    }

    if (!scenarioData) {
      throw new Error('no scenario data provided');
    }

    // if job succeeds
    await this.db.transaction(async (tx) => {
      // update the 2 tables (master table + generated)
      await tx.update(scenariosGeneratedTable).set(scenarioData);
      await tx.insert(scenariosTable).values(scenarioData);

      // update job
      await tx.update(jobsTable).set({
        id: job_id,
        status: job_status,
      });
    });

    // after this is done, send websocket message
    this.eventsGateway.onScenarioJobSuccess({
      jobId: job_id,
      scenarioData,
    });
  }
}
