import { usersTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectUserDto
  implements Omit<InferSelect<typeof usersTable>, 'password'>
{
  id: number;
  username: string;
}
