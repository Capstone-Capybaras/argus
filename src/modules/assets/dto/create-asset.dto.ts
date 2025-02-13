import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { assetsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateAssetDto implements InferInsert<typeof assetsTable> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  users: string;

  @IsNotEmpty()
  @IsString()
  function: string;

  @IsString()
  sensitive_info: string;

  @IsString()
  category: string;

  @IsInt()
  entity_id: number;
}
