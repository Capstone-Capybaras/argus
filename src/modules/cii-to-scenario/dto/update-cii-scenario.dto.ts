import { IsInt, IsString } from 'class-validator';
import { CIIToScenariosTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateCIIScenarioDto
  implements InferUpdate<typeof CIIToScenariosTable>
{
  @IsInt()
  CII_id: number;

  @IsString()
  scenario_number: string;
}
