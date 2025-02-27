import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { mselTable } from 'src/database/schema';
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
