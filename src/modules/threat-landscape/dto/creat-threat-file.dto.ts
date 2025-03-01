import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { threatFilesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class ThreatFilesDto implements InferInsert<typeof threatFilesTable> {
  @IsInt()
  @IsNotEmpty()
  entity_id: number;

  @IsString()
  @IsNotEmpty()
  file_key: string;

  @IsDate()
  @IsNotEmpty()
  date_uploaded: Date;
}
