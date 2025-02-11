import { masterThreatCubesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectMasterThreatCubeDto
  implements InferSelect<typeof masterThreatCubesTable>
{
  category: string;
  name: string;
  id: number;
}
