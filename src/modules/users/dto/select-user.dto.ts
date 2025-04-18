import { usersTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectUserDto
  implements Omit<InferSelect<typeof usersTable>, 'password'>
{
  is_super_user: boolean;
  is_active: boolean;
  id: number;
  username: string;
}
