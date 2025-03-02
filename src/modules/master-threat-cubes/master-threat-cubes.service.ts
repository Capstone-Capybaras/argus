import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  masterThreatCubesTable,
  entitiesToThreatCubesTable,
  cubesToTacticsTable,
  tacticsTable,
} from 'src/database/schema';
import { eq } from 'drizzle-orm';
import {
  CreateCubeToTacticJoinDto,
  CreateEntityToCubeJoinDto,
  CreateMasterThreatCubeDto,
} from './dto/create-master-threat.dto';
import { UpdateMasterThreatCubeDto } from './dto/update-master-threat.dto';
import { S3Service } from 'src/email/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MasterThreatCubesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  // Create new master threat cube
  async createMasterThreatCube(data: CreateMasterThreatCubeDto) {
    const result = await this.db
      .insert(masterThreatCubesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllMasterThreatCubes() {
    const masterThreatCubesList = await this.db
      .select()
      .from(masterThreatCubesTable);
    return masterThreatCubesList;
  }

  async getMasterThreatCubeById(id: string) {
    const masterThreatCube = await this.db
      .select()
      .from(masterThreatCubesTable)
      .where(eq(masterThreatCubesTable.id, id));
    return masterThreatCube[0];
  }

  async updateMasterThreatCube(id: string, data: UpdateMasterThreatCubeDto) {
    const result = await this.db
      .update(masterThreatCubesTable)
      .set(data)
      .where(eq(masterThreatCubesTable.id, id))
      .returning();
    return result[0];
  }

  async deleteMasterThreatCube(id: string): Promise<boolean> {
    const result = await this.db
      .delete(masterThreatCubesTable)
      .where(eq(masterThreatCubesTable.id, id))
      .returning();
    return result.length > 0;
  }

  async getCubesByEntity(entityId: number) {
    const results = await this.db
      .select({
        tactic: tacticsTable.name,
        technique: masterThreatCubesTable.name,
        score: entitiesToThreatCubesTable.score,
      })
      .from(entitiesToThreatCubesTable)
      .innerJoin(
        masterThreatCubesTable,
        eq(
          entitiesToThreatCubesTable.threat_cube_id,
          masterThreatCubesTable.id,
        ),
      )
      .innerJoin(
        cubesToTacticsTable,
        eq(masterThreatCubesTable.id, cubesToTacticsTable.technique_id),
      )
      .innerJoin(
        tacticsTable,
        eq(cubesToTacticsTable.tactic_id, tacticsTable.id),
      )
      .where(eq(entitiesToThreatCubesTable.entity_id, entityId));
    return results;
  }

  async getTTPsfromEntity(entityId: number) {
    const ttps = await this.getCubesByEntity(entityId);
    const groupedResults = ttps.reduce(
      (acc, { tactic, technique, score }) => {
        if (!acc[tactic]) {
          acc[tactic] = [];
        }
        acc[tactic].push({ technique: technique, score: score });
        return acc;
      },
      {} as Record<string, { technique: string; score: number }[]>,
    );

    //sort
    Object.entries(groupedResults).forEach(([tactic, techniques]) => [
      tactic,
      techniques.sort((a, b) => b.score - a.score), // Sort descending by score
    ]);

    return groupedResults;

    // Convert to desired format
    // return Object.entries(groupedResults).map(([tactic, {techn}]) => ({
    //   tactic,
    //   techniques,
    //   score
    // }));
  }

  async createMultipleThreatCube(data: CreateMasterThreatCubeDto[]) {
    const result = await this.db
      .insert(masterThreatCubesTable)
      .values(data)
      .returning();
    return result[0];
  }

  // async addFromJson(){
  //   const fileBuffer = fs.readFileSync('./src/modules/threat-landscape/test/allTechs.json', "utf-8");
  //   const data = JSON.parse(fileBuffer);
  //   const res = await this.createMultipleThreatCube(data);
  //   return res
  // }

  async createJoinToTacs(data: CreateCubeToTacticJoinDto[]) {
    const result = await this.db
      .insert(cubesToTacticsTable)
      .values(data)
      .returning();
    return result[0];
  }

  // async addRelationFromJson(){
  //   const fileBuffer = fs.readFileSync('./src/modules/threat-landscape/test/joins.json', "utf-8");
  //   const data = JSON.parse(fileBuffer);
  //   const res = await this.createJoinToTacs(data);
  //   return res
  // }

  async createJoinThreatCubeToEntity(data: CreateEntityToCubeJoinDto[]) {
    const result = await this.db
      .insert(entitiesToThreatCubesTable)
      .values(data)
      .returning();
    return result;
  }

  async createHeatmap(entityId: number, key: string) {
    const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
    const fileBuffer = await this.s3Service.downloadFile(bucketName, key);
    //const fileBuffer = fs.readFileSync('./src/modules/threat-landscape/test/layer_by_operation.json', "utf-8");
    const data = JSON.parse(fileBuffer.toString('utf-8'));
    const uniqueTechniquesMap = new Map<string, CreateEntityToCubeJoinDto>();
    const version = data.versions.attack;
    data.techniques.forEach((tech: { techniqueID: string; score: number }) => {
      uniqueTechniquesMap.set(tech.techniqueID, {
        entity_id: entityId,
        threat_cube_id: tech.techniqueID,
        score: tech.score,
        version: version,
      });
    });
    const techniques: CreateEntityToCubeJoinDto[] = Array.from(
      uniqueTechniquesMap.values(),
    );
    //const techniques: CreateEntityToCubeJoinDto[] = data.techniques.map((tech: {techniqueID: string; score: number; })=>({entity_id: entityId, threat_cube_id: tech.techniqueID, score:tech.score}))
    const res = await this.createJoinThreatCubeToEntity(techniques);
    return res;
  }
}
