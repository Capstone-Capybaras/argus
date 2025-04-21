import { IsString, IsInt, IsOptional, IsIn } from 'class-validator';
import { threatLandscapeTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateThreatLandscapeDto
  implements InferUpdate<typeof threatLandscapeTable>
{
  // composite-primary-key
  @IsInt()
  entity_id: number;

  @IsString()
  threat_actor_name: string;
  // ---------
  @IsIn(['Material', 'Impending', 'Insubstantial', 'Potential', null])
  category: 'Material' | 'Impending' | 'Potential' | 'Insubstantial' | null;

  @IsString()
  @IsOptional()
  capability?: string | null;

  @IsString()
  @IsOptional()
  capability_reason?: string | null;

  @IsString()
  @IsOptional()
  intent?: string | null;

  @IsString()
  @IsOptional()
  intent_reason?: string | null;

  @IsString()
  @IsOptional()
  opportunity?: string | null;

  @IsString()
  @IsOptional()
  opportunity_reason?: string | null;

  @IsString()
  file_key: string;
}
