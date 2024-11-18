import { usersTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectUserDto implements InferSelect<typeof usersTable> {
  id: number;
  username: string;
  password: string;
}
