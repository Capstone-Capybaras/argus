// injects.service.ts
import { Injectable, Inject } from '@nestjs/common';
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
    private readonly eventsGateway: EventsGateway,
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
    const job = await this.db.transaction(async (tx) => {
      // insert base record into generated table
      await tx.insert(injectsGeneratedTable).values({
        scenario_number: data.scenario_number,
        scenario_project_id: data.project_id,
        generation_inputs: generationInputs,
        iteration: 0,
      });

      const [createdJob] = await tx
        .insert(jobsTable)
        .values({
          type: 'msel',
          status: 'pending',
          name: data.job_name,
          project_id: data.project_id,
        })
        .returning();

      return createdJob;
    });

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

    if (!injects || injects.length === 0) {
      throw new Error('no injects provided');
    }

    // if job succeeds
    // await this.db.transaction(async (tx) => {
    //   // update the 2 inject tables (master table + generated)
    //   // TODO: it's a list of injects that is GENERATED, so how to first insert in the generation inputs if I don't know the inject IDs?
    //   await tx
    //     .update(scenariosGeneratedTable)
    //     .set(scenarioData)
    //     .where(
    //       and(
    //         eq(
    //           scenariosGeneratedTable.scenario_number,
    //           scenarioData.scenario_number,
    //         ),
    //         eq(scenariosGeneratedTable.project_id, scenarioData.project_id),
    //       ),
    //     );
    //   await tx.insert(scenariosTable).values(scenarioData);

    //   // update job
    //   await tx
    //     .update(jobsTable)
    //     .set({
    //       id: job_id,
    //       status: job_status,
    //     })
    //     .where(eq(jobsTable.id, job_id));
    // });
  }
}
