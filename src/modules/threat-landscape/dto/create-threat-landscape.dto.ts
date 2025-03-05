import { IsString, IsInt } from 'class-validator';
import { threatLandscapeTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateThreatLandscapeDto
  implements InferUpdate<typeof threatLandscapeTable>
{
  @IsInt()
  entity_id: number;

  @IsString()
  threat_actor_name: string;

  @IsString()
  category: 'Material' | 'Impending' | 'Potential' | 'Insubstantial' | null;

  @IsString()
  capability: string;

  @IsString()
  capability_reason: string;

  @IsString()
  intent: string;

  @IsString()
  intent_reason: string;

  @IsString()
  opportunity: string;

  @IsString()
  opportunity_reason: string;

  @IsString()
  file_key: string;
}
