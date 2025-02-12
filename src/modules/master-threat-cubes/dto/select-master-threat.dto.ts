import { masterThreatCubesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectMasterThreatCubeDto
  implements InferSelect<typeof masterThreatCubesTable>
{
  threat_cube_id: number;
  name: string | null;
  tactic: string;
}
