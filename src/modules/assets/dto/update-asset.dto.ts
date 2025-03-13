import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { assetsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';
import { AssetComponent } from './asset-component.dto';

export class UpdateAssetDto implements InferUpdate<typeof assetsTable> {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  users?: string | null;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  function?: string | null;

  @IsOptional()
  @IsString()
  sensitive_info?: string | null;

  @IsOptional()
  @IsIn(['IT', 'IOT', 'OT'])
  category?: 'IT' | 'IOT' | 'OT' | null;

  @IsOptional()
  @IsInt()
  entity_id?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AssetComponent)
  components?: AssetComponent[];
}
