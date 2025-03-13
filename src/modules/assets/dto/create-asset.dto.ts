import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { assetsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';
import { AssetComponent } from './asset-component.dto';
import { Type } from 'class-transformer';

export class CreateAssetDto implements InferInsert<typeof assetsTable> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  users?: string | null;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  function?: string | null;

  @IsString()
  @IsOptional()
  sensitive_info?: string | null;

  @IsIn(['IT', 'IOT', 'OT'])
  @IsOptional()
  category?: 'IT' | 'IOT' | 'OT' | null;

  @IsInt()
  entity_id: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AssetComponent)
  components?: AssetComponent[];
}
