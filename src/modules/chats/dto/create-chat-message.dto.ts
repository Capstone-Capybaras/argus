import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { chatMessagesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateChatMessageDto
  implements InferInsert<typeof chatMessagesTable>
{
  @IsUUID()
  chat_id: string;

  @IsString()
  role: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  files?: string[];
}
