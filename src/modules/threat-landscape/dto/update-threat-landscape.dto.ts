import { IsString, IsInt, IsOptional } from 'class-validator';
import { threatLandscapeTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateThreatLandscapeDto
  implements InferUpdate<typeof threatLandscapeTable>
{
  // composite-primary-key
  @IsInt()
  project_id: number;

  @IsInt()
  entity_id: number;

  @IsString()
  threat_actor_name: string;
  // ---------

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  capability?: string;

  @IsString()
  @IsOptional()
  capability_reason?: string;

  @IsString()
  @IsOptional()
  intent?: string;

  @IsString()
  @IsOptional()
  intent_reason?: string;

  @IsString()
  @IsOptional()
  opportunity?: string;

  @IsString()
  @IsOptional()
  opportunity_reason?: string;
}
