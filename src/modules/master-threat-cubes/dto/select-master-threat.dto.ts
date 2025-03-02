import { masterThreatCubesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectMasterThreatCubeDto
  implements InferSelect<typeof masterThreatCubesTable>
{
  id: string;
  name: string;
  version: string;
}
