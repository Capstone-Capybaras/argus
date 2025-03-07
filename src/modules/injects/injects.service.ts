// injects.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, max, sql, and, inArray } from 'drizzle-orm';
import {
  injectsGeneratedTable,
  injectsTable,
  jobsTable,
  projectsTable,
} from 'src/database/schema';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { GenerateMselDto } from './dto/generate-msel.dto';
import { SelectJobDto } from '../jobs/dto/select-job.dto';
import { AetherService } from '../aether/aether.service';
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

  async getInjectsByProjectId(project_id: number) {
    const latestIterations = await this.db
      .select({
        project_id: injectsTable.project_id,
        scenarios: injectsTable.scenario_number,
        latest_iteration: max(injectsTable.iteration), // Get the latest iteration for each scenario
      })
      .from(injectsTable)
      .where(eq(injectsTable.project_id, project_id))
      .groupBy(injectsTable.project_id, injectsTable.scenario_number); // Group by project_id, scenarios, and key

    const scenarioNumbers = latestIterations
      .map((item) => item.scenarios)
      .filter((value): value is string => value !== null);
    console.log('scenario numbers: ', scenarioNumbers);
    const iterations = latestIterations
      .map((item) => item.latest_iteration)
      .filter((value): value is number => value !== null);
    console.log('interations: ', iterations);
    // Then you can retrieve the full items (with all columns) for each latest iteration
    const injectsWithLatestIteration = await this.db
      .select()
      .from(injectsTable)
      .where(
        and(
          eq(injectsTable.project_id, project_id),
          inArray(
            injectsTable.scenario_number,
            sql`(SELECT DISTINCT scenario_number FROM injects WHERE project_id = ${project_id})`,
          ),
          inArray(
            injectsTable.iteration,
            sql`(SELECT MAX(i.iteration) FROM injects i WHERE i.scenario_number = injects.scenario_number AND i.project_id = ${project_id})`,
          ),
        ),
      );
    return injectsWithLatestIteration;
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
    const entity = await this.entityService.getPlainEntityById(asset.entity_id);
    if (!entity) {
      throw new Error(
        `Could not find entity with ID ${asset.entity_id} when generating msel`,
      );
    }
    // get roles
    const roles = (await this.rolesService.getAllRolesForEntity(entity.id)).map(
      (r) => r.name,
    );
    //get exercise type
    const [project] = await this.db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, data.project_id))
      .limit(1);
    if (!project) {
      throw new Error(
        `Could not get exercise type from project ${data.project_id}`,
      );
    }
    const exercise_type = project.exercise_type;
    // create job
    const generationInputs = {
      exercise_type,
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
      exercise_type,
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
      for (const inject of injects) {
        const { scenario_number, project_id } = inject;
        if (!scenario_number) {
          throw Error(
            `No scenario number for generated inject: ${inject.inject_id}`,
          );
        }
        // Get the latest iteration for the scenario_number and project_id
        const [latestIteration] = await this.db
          .select({ iteration: sql`MAX(${injectsTable.iteration})` }) // Get max iteration
          .from(injectsTable)
          .where(
            and(
              eq(injectsTable.project_id, project_id),
              eq(injectsTable.scenario_number, scenario_number),
            ),
          );

        // If no previous injects exist, set iteration to 0; otherwise, increment
        const newIteration = latestIteration
          ? Number(latestIteration.iteration) + 1
          : 0;

        // Insert the new inject with the updated iteration
        await tx.insert(injectsTable).values({
          ...inject, // Spread existing inject values
          iteration: newIteration,
        });

        //insert generated table
        await tx.insert(injectsGeneratedTable).values({
          ...inject,
          iteration: newIteration,
          generation_inputs: generationInputs,
        });
      }

      // update job
      await tx
        .update(jobsTable)
        .set({
          id: job_id,
          status: job_status,
        })
        .where(eq(jobsTable.id, job_id));
    });

    // remove redis item
    this.redisService.deleteRedisItem(String(job_id));
  }
}
