import { chatMessagesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectChatMessageDto
  implements InferSelect<typeof chatMessagesTable>
{
  id: string;
  created_at: Date;
  updated_at: Date;
  chat_id: string;
  role: string;
  content: string;
  files: string[] | null;
}
