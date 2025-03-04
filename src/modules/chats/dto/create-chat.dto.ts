import { IsNumber, IsString } from 'class-validator';
import { chatsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateChatDto
  implements Omit<InferInsert<typeof chatsTable>, 'user_id'>
{
  @IsNumber()
  project_id: number;

  @IsString()
  name: string;
}
