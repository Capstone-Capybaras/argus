import { rolesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectRoleDto implements InferSelect<typeof rolesTable> {
  name: string;
  entity_id: number;
  description: string | null;
}
