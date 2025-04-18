import { usersTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectUserDto
  implements Omit<InferSelect<typeof usersTable>, 'password'>
{
  is_active: boolean;
  id: number;
  username: string;
}
