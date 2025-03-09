import { Injectable, Inject, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  threatLandscapeTable,
  jobsTable,
  entitiesTable,
  assetsTable,
  threatLandscapeGeneratedTable,
  threatFilesTable,
} from '../../database/schema';
import { CreateThreatLandscapeDto } from './dto/create-threat-landscape.dto';
import { UpdateThreatLandscapeDto } from './dto/update-threat-landscape.dto';
import { and, eq, desc, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { AetherService } from '../aether/aether.service';
import { RedisService } from 'src/email/redis/redis.service';
import { GenerateThreatCallbackDto } from './dto/generate-threat-callback.dto';
import { JobsService } from '../jobs/jobs.service';
import { GenerateThreatDto } from './dto/generate-threat.dto';
import { ThreatFilesDto } from './dto/creat-threat-file.dto';

@Injectable()
export class ThreatLandscapeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly aetherService: AetherService,
    private readonly redisService: RedisService,
    private readonly jobsService: JobsService,
  ) {}

  // Create a new threat landscape
  async createThreatLandscape(data: CreateThreatLandscapeDto) {
    const result = await this.db
      .insert(threatLandscapeTable)
      .values(data)
      .returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all threat landscapes
  async getAllThreatLandscape() {
    const threatLandscape = await this.db.select().from(threatLandscapeTable);
    return threatLandscape;
  }

  // Retrieve specific threat landscapes by entity id
  async getThreatLandscapeByEntityIdAndFile(
    entity_id: number,
    file_key: string,
  ) {
    const threatLandscapes = await this.db
      .select()
      .from(threatLandscapeTable)
      .where(
        and(
          eq(threatLandscapeTable.entity_id, entity_id),
          eq(threatLandscapeTable.file_key, file_key),
        ),
      );
    return threatLandscapes;
  }

  //Retrieve latest threat landscape
  async getLatestThreatLandscape(entity_id: number) {
    const mostRecentFile = await this.db
      .select()
      .from(threatFilesTable)
      .where(eq(threatFilesTable.entity_id, entity_id))
      .orderBy(desc(threatFilesTable.date_uploaded)) // Sort in descending order
      .limit(1);
    if (!mostRecentFile || mostRecentFile.length === 0) {
      return;
    }
    try {
      const threats = await this.getThreatLandscapeByEntityIdAndFile(
        entity_id,
        mostRecentFile[0].file_key,
      );
      if (!threats || threats.length === 0) {
        throw new Error(
          `No Threatlandscape found for entity: ${entity_id} and file: ${mostRecentFile[0].file_key}`,
        );
      }
      return threats;
    } catch (error) {
      console.log(`Error getting threat Landscape: ${error}`);
    }
  }

  // Update a threat landscape by primary key (threat actor name and entity id)
  async updateThreatLandscape(data: UpdateThreatLandscapeDto) {
    const result = await this.db
      .update(threatLandscapeTable)
      .set(data)
      .where(
        and(
          eq(threatLandscapeTable.entity_id, data.entity_id),
          eq(threatLandscapeTable.threat_actor_name, data.threat_actor_name),
        ),
      )
      .returning();
    return result[0] || null;
  }

  async getUploadHistory(entityId: number) {
    const uploads = await this.db
      .select()
      .from(threatFilesTable)
      .where(eq(threatFilesTable.entity_id, entityId));
    return uploads;
  }

  async addFilesToDB(threatFilesDto: ThreatFilesDto) {
    const threatFileEntry = await this.db
      .insert(threatFilesTable)
      .values(threatFilesDto)
      .returning();
    return threatFileEntry;
  }

  async generateThreatLandscape(data: GenerateThreatDto) {
    const entity = await this.db
      .select()
      .from(entitiesTable)
      .where(eq(entitiesTable.id, data.entity_id))
      .limit(1);
    //const entity = await this.entityService.getEntityById(entity_id);
    if (!entity || entity.length === 0) {
      throw new Error(
        `Could not find entity with id ${data.entity_id} when generating threat landscape`,
      );
    }
    const assets = await this.db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.entity_id, data.entity_id));
    if (!assets || assets.length === 0) {
      throw new Error(
        `Could not find entity with id ${data.entity_id} when generating threat landscape`,
      );
    }
    const generationInputs = { entity: entity[0], assets: assets };

    //store in threat files table:
    const threatFilesDto: ThreatFilesDto = {
      entity_id: data.entity_id,
      file_key: data.file_key,
      date_uploaded: new Date(),
    };
    const [threatFileEntry] = await this.addFilesToDB(threatFilesDto);
    if (!threatFileEntry) {
      throw new Error('Error adding threat file to db.');
    }
    const [job] = await this.db
      .insert(jobsTable)
      .values({
        type: 'threat',
        status: 'pending',
        name: `${entity[0].name} - threatLandscape - ${new Date().toISOString()}`,
        project_id: data.project_id,
      })
      .returning();

    // set generation input in redis
    await this.redisService.setGenerationInput(
      String(job.id),
      generationInputs,
    );

    // last step: send to aether
    await this.aetherService.generateThreatLandscape({
      project_id: data.project_id,
      job_id: job.id,
      entity: entity[0],
      assets: assets,
      file_key: data.file_key,
    });

    return job;
  }

  async generateThreatCallback(data: GenerateThreatCallbackDto) {
    const { job_id, job_status, threatLandscape } = data;

    if (job_status === 'pending') return;

    if (job_status === 'failed') {
      await this.jobsService.onJobFailed(job_id);

      return;
    }

    // must make sure injects length is not 0
    if (!threatLandscape || threatLandscape.length === 0) {
      throw new Error('no injects provided');
    }

    // get generation inputs
    const generationInputs = await this.redisService.getRedisItem(
      String(job_id),
    );

    if (!generationInputs) {
      Logger.warn('No threat landscape generation input found in redis');
    }

    // if job succeeds
    await this.db.transaction(async (tx) => {
      // INSERT to the 2 threat tables (master table + generated)
      // note: we do not care about serial ID matching
      // since the generated table is just to keep track of generation input and outputs
      // insert
      //upsert
      await tx
        .insert(threatLandscapeTable)
        .values(threatLandscape)
        .onConflictDoUpdate({
          target: [
            threatLandscapeTable.threat_actor_name,
            threatLandscapeTable.entity_id,
          ],
          set: {
            ...threatLandscape,
            entity_id: sql`${threatLandscapeTable.entity_id}`,
            threat_actor_name: sql`${threatLandscapeTable.threat_actor_name}`,
          },
        });
      await tx.insert(threatLandscapeGeneratedTable).values(
        threatLandscape.map((i) => ({
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

    // remove redis item
    this.redisService.deleteRedisItem(String(job_id));
  }
}
