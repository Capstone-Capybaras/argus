import { IsInt, IsString } from 'class-validator';
import { masterThreatCubesToScenariosTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateMasterThreatToScenarioDto
  implements InferUpdate<typeof masterThreatCubesToScenariosTable>
{
  @IsInt()
  threat_cube_id: number;

  @IsString()
  scenario_number: string;
}
