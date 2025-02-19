import { IsInt, IsString } from 'class-validator';
import { masterThreatCubesTable, entitiesToThreatCubesTable, cubesToTacticsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateMasterThreatCubeDto
  implements InferInsert<typeof masterThreatCubesTable>
{
  @IsString()
  threat_cube_id: string;

  // @IsString()
  // tactic: string;

  @IsString()
  name: string;
}

export class CreateEntityToCubeJoinDto implements InferInsert<typeof entitiesToThreatCubesTable>
{
  @IsString()
  threat_cube_id: string;
  @IsInt()
  entity_id: number;
  @IsInt()
  score: number
}

export class CreateCubeToTacticJoinDto implements InferInsert<typeof cubesToTacticsTable>
{
  @IsString()
  tactic_id: string;
  @IsString()
  technique_id: string;
}

export class AddHeatMapDto {
  @IsInt()
  entity_id: number;
  @IsString()
  s3key: string;
}