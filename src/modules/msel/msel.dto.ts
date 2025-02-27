import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { injectsToScenariosTable, mselTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class UploadMselDto implements InferInsert<typeof mselTable> {
  @IsNotEmpty()
  @IsInt()
  project_id: number;

  @IsNotEmpty()
  @IsString()
  msel: string;

  @IsNotEmpty()
  date_uploaded: Date;
}

export class InjectScenarioDto
  implements InferInsert<typeof injectsToScenariosTable>
{
  @IsInt()
  project_id: number;
  @IsInt()
  inject_id: number;
  @IsString()
  scenario_number: string;
}
