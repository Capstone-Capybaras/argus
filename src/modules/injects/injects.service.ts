// injects.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import {
  injectsGeneratedTable,
  injectsTable,
  jobsTable,
} from 'src/database/schema';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { GenerateMselDto } from './dto/generate-msel.dto';
import { SelectJobDto } from '../jobs/dto/select-job.dto';
import { AetherService } from '../aether/aether.service';
import { EventsGateway } from 'src/events/events.gateway';
import { ScenarioService } from '../scenario/scenario.service';
import { TtpUsedService } from '../ttp-used/ttp-used.service';
import { EntityService } from '../entity/entity.service';
import { AssetsService } from '../assets/assets.service';
import { RolesService } from '../roles/roles.service';
import { GenerateMselCallbackDto } from './dto/generate-msel-callback.dto';
import { JobsService } from '../jobs/jobs.service';
import { RedisService } from 'src/email/redis/redis.service';

@Injectable()
export class InjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly aetherService: AetherService,
    private readonly scenarioService: ScenarioService,
    private readonly ttpUsedService: TtpUsedService,
    private readonly entityService: EntityService,
    private readonly assetService: AssetsService,
    private readonly rolesService: RolesService,
    private readonly jobsService: JobsService,
    private readonly redisService: RedisService,
  ) {}

  async createInject(data: CreateInjectDto) {
    const result = await this.db.insert(injectsTable).values(data).returning();
    return result[0];
  }

  async getInjects() {
    const injects = await this.db.select().from(injectsTable);
    return injects;
  }

  async getInjectByName(id: string) {
    const inject = await this.db
      .select()
      .from(injectsTable)
      .where(eq(injectsTable.inject_id, id))
      .limit(1);
    return inject[0] || null;
  }

  async updateInject(id: string, data: UpdateInjectDto) {
    const result = await this.db
      .update(injectsTable)
      .set(data)
      .where(eq(injectsTable.inject_id, id))
      .returning();
    return result[0] || null;
  }

  async deleteInject(id: string) {
    const result = await this.db
      .delete(injectsTable)
      .where(eq(injectsTable.inject_id, id))
      .returning();
    return result[0] || null;
  }

  async generateMsel(data: GenerateMselDto): Promise<SelectJobDto> {
    // get scenario
    const scenario = await this.scenarioService.getScenarioByNumber(
      data.scenario_number,
      data.project_id,
    );

    if (!scenario) {
      throw new Error(
        `Could not find scenario with number ${data.scenario_number} when generating msel`,
      );
    }

    // get ttp(s)
    const ttpUsed = await this.ttpUsedService.getAllTtpUsedByScenario(
      data.scenario_number,
      data.project_id,
    );

    // get asset
    const asset = await this.assetService.getAssetById(scenario.asset_id);
    if (!asset) {
      throw new Error(
        `Could not find asset with ID ${scenario.asset_id} when generating msel`,
      );
    }

    // get entity
    const entity = await this.entityService.getEntityById(asset.entity_id);
    if (!entity) {
      throw new Error(
        `Could not find entity with ID ${asset.entity_id} when generating msel`,
      );
    }
    // get roles
    const roles = (await this.rolesService.getAllRolesForEntity(entity.id)).map(
      (r) => r.name,
    );

    // create job
    const generationInputs = {
      scenario,
      ttpUsed,
      entity,
      asset,
      roles,
    };

    const [job] = await this.db
      .insert(jobsTable)
      .values({
        type: 'msel',
        status: 'pending',
        name: data.job_name,
        project_id: data.project_id,
      })
      .returning();

    // set generation input in redis
    await this.redisService.setGenerationInput(
      String(job.id),
      generationInputs,
    );

    // last step: send to aether
    await this.aetherService.generateMsel({
      job_id: job.id,
      project_id: data.project_id,
      start_datetime: data.start_datetime,
      end_datetime: data.end_datetime,
      scenario,
      ttpUsed,
      entity,
      asset,
      roles,
    });

    return job;
  }

  async generateMselCallback(data: GenerateMselCallbackDto) {
    const { job_id, job_status, injects } = data;

    if (job_status === 'pending') return;

    if (job_status === 'failed') {
      await this.jobsService.onJobFailed(job_id);

      return;
    }

    // must make sure injects length is not 0
    if (!injects || injects.length === 0) {
      throw new Error('no injects provided');
    }

    // get generation inputs
    const generationInputs = await this.redisService.getRedisItem(
      String(job_id),
    );

    if (!generationInputs) {
      Logger.warn('No msel generation input found in redis');
    }

    // if job succeeds
    await this.db.transaction(async (tx) => {
      // INSERT to the 2 inject tables (master table + generated)
      // note: we do not care about serial ID matching
      // since the generated table is just to keep track of generation input and outputs
      await tx.insert(injectsTable).values(injects);
      await tx.insert(injectsGeneratedTable).values(
        injects.map((i) => ({
          ...i,
          generation_inputs: generationInputs,
        })),
      );

      // update job
      await tx
        .update(jobsTable)
        .set({
          id: job_id,
          status: job_status,
        })
        .where(eq(jobsTable.id, job_id));
    });

    // after this is done, send websocket message
    // this.eventsGateway.onScenarioJobSuccess({
    //   jobId: job_id,
    //   scenarioData,
    // });

    // remove redis item
    this.redisService.deleteRedisItem(String(job_id));
  }
}
