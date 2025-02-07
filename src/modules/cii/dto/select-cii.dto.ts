import { CIITable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectCIIDto implements InferSelect<typeof CIITable> {
  function: string;
  id: number;
  name: string;
  users: string;
  sensitive_info: string;
  category: string;
  entity_id: number;
}
