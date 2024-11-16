import { IsString, IsUrl } from 'class-validator';
import { entitiesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateEntityDto implements InferUpdate<typeof entitiesTable> {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsString()
  victim_sector?: string;

  @IsString()
  CII?: string;

  @IsString()
  critical_function?: string;

  @IsUrl()
  policy_documents?: string; // Assuming it's a URL; adjust as needed if it's a file path
}
