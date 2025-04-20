import { Injectable, Inject, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  assetsTable,
  jobsTable,
  scenariosGeneratedTable,
  scenariosTable,
  ttpUsedTable,
  entitiesTable,
} from '../../database/schema';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { GenerateScenarioDto } from './dto/generate-scenario.dto';
import { EntityService } from '../entity/entity.service';
import { AssetsService } from '../assets/assets.service';
import { JobsService } from '../jobs/jobs.service';
import { GenerateScenarioCallbackDto } from './dto/generate-scenario-callback.dto';
import { saveScenarioLearningsCallbackDto } from './save-learnings.dto';
import {
  SelectScenarioWithAssetDto,
  SelectScenarioByNumberDto,
} from './dto/select-scenario.dto';
import { AetherService } from '../aether/aether.service';
import { MasterThreatCubesService } from '../master-threat-cubes/master-threat-cubes.service';
import { ThreatLandscapeService } from '../threat-landscape/threat-landscape.service';
import { AetherScenarioLearningDto } from '../aether/dto/aether-scenario-learnings.dto';
import { RedisService } from 'src/email/redis/redis.service';

@Injectable()
export class ScenarioService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly entityService: EntityService,
    private readonly assetService: AssetsService,
    private readonly jobsService: JobsService,
    private readonly aetherService: AetherService,
    private readonly masterThreatCubeService: MasterThreatCubesService,
    private readonly threatLandscapeService: ThreatLandscapeService,
    private readonly redisService: RedisService,
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
    const scenarios = await this.db
      .select()
      .from(scenariosTable)
      .orderBy(scenariosTable.scenario_number);
    return scenarios;
  }

  // Retrieve a specific scenario by scenario_number
  // TODO: query by project ID too??
  async getScenarioByNumber(
    scenario_number: string,
    project_id: number,
  ): Promise<SelectScenarioByNumberDto | void> {
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
      .where(
        and(
          eq(scenariosTable.scenario_number, scenario_number),
          eq(scenariosTable.project_id, project_id),
        ),
      );

    if (rows.length === 0) return;

    const result = rows.reduce<SelectScenarioByNumberDto>((acc, row) => {
      const { scenarios, ttp_used } = row;

      if (!acc.scenario_number) {
        acc = {
          ttp_used: [],
          ...scenarios,
          asset_name: '',
          entity_name: '',
        };
      }

      if (!ttp_used) return acc;

      acc.ttp_used.push(ttp_used);

      return acc;
    }, {} as SelectScenarioByNumberDto);

    // get entity and asset names
    const { entity_id, name } = await this.assetService.getAssetById(
      result.asset_id,
    );
    const { name: entity_name } =
      await this.entityService.getPlainEntityById(entity_id);

    result.asset_name = name;
    result.entity_name = entity_name;

    return result;
  }

  // Retrieve scenarios by project_id
  async getScenariosByProject(
    project_id: number,
  ): Promise<SelectScenarioWithAssetDto[] | void> {
    const rows = await this.db
      .select()
      .from(scenariosTable)
      .orderBy(scenariosTable.scenario_number)
      .leftJoin(assetsTable, eq(scenariosTable.asset_id, assetsTable.id))
      .where(eq(scenariosTable.project_id, project_id));

    if (rows.length === 0) return;

    const visitedScenarioNumbers = new Set<string>();
    return rows.reduce<SelectScenarioWithAssetDto[]>((acc, row) => {
      const { scenarios, assets } = row;

      if (!assets) return acc;

      if (!visitedScenarioNumbers.has(scenarios.scenario_number)) {
        acc.push({
          ...scenarios,
          assets: [],
        });
        visitedScenarioNumbers.add(scenarios.scenario_number);
      }

      acc
        .find((s) => s.scenario_number === scenarios.scenario_number)
        ?.assets.push(assets);

      return acc;
    }, [] as SelectScenarioWithAssetDto[]);
  }

  // Update a scenario by scenario_number
  async updateScenario(
    project_id: number,
    scenario_number: string,
    data: UpdateScenarioDto,
  ) {
    const result = await this.db
      .update(scenariosTable)
      .set(data)
      .where(
        and(
          eq(scenariosTable.scenario_number, scenario_number),
          eq(scenariosTable.project_id, project_id),
        ),
      )
      .returning();
    return result[0] || null;
  }

  async learnScenario(project_id: number, scenario_number: string) {
    const scenario = await this.db
      .select()
      .from(scenariosTable)
      .where(
        and(
          eq(scenariosTable.scenario_number, scenario_number),
          eq(scenariosTable.project_id, project_id),
        ),
      )
      .limit(1);
    if (scenario.length === 0) {
      throw new Error(
        `Scenario ${scenario_number} does not exist in project ${project_id}.`,
      );
    }
    if (!scenario[0].save_to_learnings) {
      return { job: null };
    }
    const assetId = scenario[0].asset_id;
    const asset = await this.db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.id, assetId));
    const entityId = asset[0].entity_id;
    const entity = await this.db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, entityId));

    //create job
    const [createdJob] = await this.db
      .insert(jobsTable)
      .values({
        type: 'learning',
        status: 'pending',
        name: `[Save Learning] - ${entity[0].name}, ${scenario_number}`,
        project_id: project_id,
      })
      .returning();

    const scenarioLearningReq: AetherScenarioLearningDto = {
      project_id: project_id,
      scenario_number: scenario_number,
      scenario: scenario[0],
      asset: asset[0],
      entity: entity[0],
      job_id: createdJob.id,
    };
    try {
      await this.aetherService.saveScenarioLearnings(scenarioLearningReq);
      return { job: createdJob };
    } catch (err) {
      Logger.error(`Could not send generate scenario to aether: ${err}`);
      await this.jobsService.onJobFailed(createdJob.id);
      return { job: null, error: err };
    }
  }

  // Delete a scenario by scenario_number
  async deleteScenario(
    scenario_number: string,
    project_id: number,
  ): Promise<boolean> {
    const result = await this.db
      .delete(scenariosTable)
      .where(
        and(
          eq(scenariosTable.scenario_number, scenario_number),
          eq(scenariosTable.project_id, project_id),
        ),
      )
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
    const generationInputs: any = {
      entity: entityInfo,
      asset,
    };

    try {
      const threatLandscape =
        await this.threatLandscapeService.getLatestThreatLandscape(
          generateScenarioDto.entity_id,
        );
      if (threatLandscape && threatLandscape.length > 0) {
        const materialThreats = threatLandscape.filter(
          (threats) => threats.category === 'Material',
        );
        generationInputs['threatLandscape'] = materialThreats;
      }
    } catch (error) {
      console.log(
        `Could not get threat landscape for entity: ${generateScenarioDto.entity_id}. Error:${error}`,
      );
    }

    try {
      const ttpMap = await this.masterThreatCubeService.getTTPsfromEntity(
        generateScenarioDto.entity_id,
      );
      generationInputs['ttpHeatMap'] = ttpMap;
    } catch (error) {
      console.log(
        `Could not get ttps for entity: ${generateScenarioDto.entity_id}. Error:${error}`,
      );
    }

    // create job and return it
    const job = await this.db.transaction(async (tx) => {
      // create job
      const [createdJob] = await tx
        .insert(jobsTable)
        .values({
          type: 'scenario',
          status: 'pending',
          name: generateScenarioDto.scenario_number,
          project_id: generateScenarioDto.project_id,
        })
        .returning();

      return createdJob;
    });

    // set generation input in redis
    await this.redisService.setGenerationInput(
      String(job.id),
      generationInputs,
    );

    try {
      await this.aetherService.generateScenario({
        ...generationInputs,
        scenario_number: generateScenarioDto.scenario_number,
        project_id: generateScenarioDto.project_id,
        additional_context: generateScenarioDto.additional_context,
        job_id: job.id,
        threat_actor_motivation: generateScenarioDto.threat_actor_motivation,
      });
    } catch (err) {
      Logger.error(`Could not send generate scenario to aether: ${err}`);
      await this.jobsService.onJobFailed(job.id);
    }

    return job;
  }

  async generateScenarioCallback(data: GenerateScenarioCallbackDto) {
    const { job_status, job_id, scenarios: scenarioData, ttpUsed } = data;

    if (job_status === 'pending') return;

    if (job_status === 'failed') {
      await this.jobsService.onJobFailed(job_id);

      return;
    }

    if (!scenarioData) {
      throw new Error('no scenario data provided');
    }
    if (!ttpUsed) {
      throw new Error('no ttp used data provided');
    }

    if (ttpUsed.length === 0) {
      throw new Error('ttp used cannot be an empty array');
    }

    // if job succeeds

    // get inputs from redis
    const generationInputs = await this.redisService.getRedisItem(
      String(job_id),
    );

    if (!generationInputs) {
      Logger.warn('No scenario generation input found in redis');
    }
    await this.db.transaction(async (tx) => {
      //upsert scenario table
      await tx
        .insert(scenariosTable)
        .values(scenarioData)
        .onConflictDoUpdate({
          target: [scenariosTable.scenario_number, scenariosTable.project_id],
          set: {
            ...scenarioData,
            project_id: sql`${scenariosTable.project_id}`,
            scenario_number: sql`${scenariosTable.scenario_number}`,
          },
        });

      //insert to generated table
      const addedGenInputs = scenarioData.map((scenario) => ({
        ...scenario,
        generation_inputs: generationInputs,
      }));
      await tx.insert(scenariosGeneratedTable).values(addedGenInputs);

      // if exists previously generated ttp used, delete
      const scenario_numbers = scenarioData.map(
        (scenario) => scenario.scenario_number,
      );
      await tx
        .delete(ttpUsedTable)
        .where(
          and(
            inArray(ttpUsedTable.scenario_number, scenario_numbers),
            eq(ttpUsedTable.scenario_project_id, scenarioData[0].project_id),
          ),
        );
      // update ttp used table
      await tx.insert(ttpUsedTable).values(ttpUsed);

      // update job
      await tx
        .update(jobsTable)
        .set({
          id: job_id,
          status: job_status,
        })
        .where(eq(jobsTable.id, job_id));
    });
  }

  async saveScenarioLearningsCallback(data: saveScenarioLearningsCallbackDto){
    this.db.update(jobsTable).set({
      id: data.job_id,
      status: data.job_status
    })
    .where(eq(jobsTable.id, data.job_id))
  }
}
