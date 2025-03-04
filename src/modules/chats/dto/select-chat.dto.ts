import { chatsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectChatDto implements InferSelect<typeof chatsTable> {
  name: string;
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: number;
  project_id: number;
}
