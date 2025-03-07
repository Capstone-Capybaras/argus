import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { injectsToScenariosTable, mselTable } from 'src/database/schema';
import { InferInsert, InferSelect } from 'src/utils/modelToDtoTypes';
import { SelectInjectDto } from '../injects/dto/select-inject.dto';

export class CreateMselDto implements InferInsert<typeof mselTable> {
  @IsNotEmpty()
  @IsInt()
  project_id: number;

  @IsNotEmpty()
  @IsString()
  msel: string;

  @IsNotEmpty()
  date_uploaded: Date;
}

export class SelectMselDto implements InferSelect<typeof mselTable> {
  msel: string;
  project_id: number;
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

export class UploadMselDto {
  @IsInt()
  project_id: number;
  @IsString()
  file_key: string;
}

export interface SuccessUploadResponse {
  success: true;
  injects: SelectInjectDto[];
}

export interface ErrorUploadResponse {
  success: false;
  errors: string[];
}
