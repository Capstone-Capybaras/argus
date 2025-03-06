import { assetsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectAssetDto implements InferSelect<typeof assetsTable> {
  function: string | null;
  id: number;
  name: string;
  users: string | null;
  sensitive_info: string | null;
  category: 'IT' | 'IOT' | 'OT' | null;
  entity_id: number;
}
