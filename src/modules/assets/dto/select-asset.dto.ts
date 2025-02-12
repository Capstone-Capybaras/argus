import { assetsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectAssetDto implements InferSelect<typeof assetsTable> {
  function: string;
  id: number;
  name: string;
  users: string;
  sensitive_info: string;
  category: string;
  entity_id: number;
}
