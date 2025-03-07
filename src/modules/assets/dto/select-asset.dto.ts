import { ApiProperty } from '@nestjs/swagger';
import { assetsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectAssetDto implements InferSelect<typeof assetsTable> {
  function: string | null;
  id: number;
  name: string;
  users: string | null;
  sensitive_info: string | null;
  @ApiProperty({ enum: ['IT', 'IOT', 'OT', null] })
  category: 'IT' | 'IOT' | 'OT' | null;
  entity_id: number;
}
