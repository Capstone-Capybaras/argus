import { IsIn } from 'class-validator';
import { threatLandscapeTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectThreatLandscapeDto
  implements InferSelect<typeof threatLandscapeTable>
{
  entity_id: number;
  threat_actor_name: string;

  @IsIn(['Material', 'Impending', 'Potential', 'Insubstantial', null])
  category: 'Material' | 'Impending' | 'Potential' | 'Insubstantial' | null;

  capability: string | null;
  capability_reason: string | null;
  intent: string | null;
  intent_reason: string | null;
  opportunity: string | null;
  opportunity_reason: string | null;
  file_key: string;
}
