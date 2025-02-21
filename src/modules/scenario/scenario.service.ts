import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  jobsTable,
  scenariosGeneratedTable,
  scenariosTable,
  ttpUsedTable,
} from '../../database/schema';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { and, eq } from 'drizzle-orm';
import { GenerateScenarioDto } from './dto/generate-scenario.dto';
import { EntityService } from '../entity/entity.service';
import { AssetsService } from '../assets/assets.service';
import { JobsService } from '../jobs/jobs.service';
import { GenerateScenarioCallbackDto } from './dto/generate-scenario-callback.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { SelectScenarioWithTtpDto } from './dto/select-scenario.dto';

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
  async getScenarioByNumber(
    scenario_number: string,
  ): Promise<SelectScenarioWithTtpDto | void> {
    const rows = await this.db
      .select()
      .from(scenariosTable)
      .leftJoin(
        ttpUsedTable,
        and(
          eq(scenariosTable.project_id, ttpUsedTable.scenario_project_id),
          eq(scenariosTable.scenario_number, ttpUsedTable.scenario_number),
        ),
      )
      .where(eq(scenariosTable.scenario_number, scenario_number));

    if (rows.length === 0) return;

    return rows.reduce<SelectScenarioWithTtpDto>((acc, row) => {
      const { scenarios, ttp_used } = row;

      if (!ttp_used) return acc;

      if (!acc.scenario_number) {
        acc = {
          ttp_used: [],
          ...scenarios,
        };
      }

      acc.ttp_used.push(ttp_used);

      return acc;
    }, {} as SelectScenarioWithTtpDto);
  }

  // Retrieve scenarios by project_id
  async getScenariosByProject(project_id: number) {
    const scenarios = await this.db
      .select()
      .from(scenariosTable)
      .where(eq(scenariosTable.project_id, project_id));
    return scenarios;
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

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { participants, assets, ...entityInfo } = entity;
    const generationInputs = {
      entity: entityInfo,
      asset,
    };

    // create job and return it
    const job = await this.db.transaction(async (tx) => {
      // insert base record into generated table, no content
      // the main motivation is to store the generation inputs
      await tx.insert(scenariosGeneratedTable).values({
        scenario_number: generateScenarioDto.scenario_number,
        project_id: generateScenarioDto.project_id,
        asset_id: generateScenarioDto.asset_id,
        generation_inputs: generationInputs,
      });

      // create job
      const [createdJob] = await tx
        .insert(jobsTable)
        .values({
          type: 'scenario',
          status: 'pending',
          name: generateScenarioDto.scenario_number,
        })
        .returning();

      return createdJob;
    });

    // TODO: if job is successfully inserted, send generation req to ML
    // should send scenario_number and project_id as well, as this is the PK

    return job;
  }

  async generateScenarioCallback(data: GenerateScenarioCallbackDto) {
    const { job_status, job_id, scenario: scenarioData, ttpUsed } = data;

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
    if (!ttpUsed) {
      throw new Error('no ttp used data provided');
    }

    // if job succeeds
    await this.db.transaction(async (tx) => {
      // update the 2 secnario tables (master table + generated)
      await tx.update(scenariosGeneratedTable).set(scenarioData);
      await tx.insert(scenariosTable).values(scenarioData);

      // update ttp used table
      await tx.insert(ttpUsedTable).values(ttpUsed);

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
