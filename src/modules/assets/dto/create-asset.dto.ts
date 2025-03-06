import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { assetsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateAssetDto implements InferInsert<typeof assetsTable> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  users: string | null;

  @IsNotEmpty()
  @IsString()
  function: string | null;

  @IsString()
  sensitive_info: string | null;

  @IsString()
  category: 'IT' | 'IOT' | 'OT' | null;

  @IsInt()
  entity_id: number;
}
