import { threatActorsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectThreatActorDto
  implements InferSelect<typeof threatActorsTable>
{
  id: number;
  name: string;
  category: string;
  intent: string;
  rationale: string;
  capabilities: string;
  project_id: number;
}
