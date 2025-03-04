import { Inject, Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { chatMessagesTable, chatsTable } from 'src/database/schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async getChatsForUser(userId: number) {
    return await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.user_id, userId));
  }

  async createChat(userId: number, data: CreateChatDto) {
    const [createdChat] = await this.db
      .insert(chatsTable)
      .values({
        ...data,
        user_id: userId,
      })
      .returning();

    return createdChat;
  }

  async getMessagesForChat(chatId: string) {
    return await this.db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.chat_id, chatId));
  }

  async createMessage(data: CreateChatMessageDto) {
    const [message] = await this.db
      .insert(chatMessagesTable)
      .values(data)
      .returning();

    // update chat's updated_at timestamp
    await this.db
      .update(chatsTable)
      .set({
        updated_at: new Date(),
      })
      .where(eq(chatsTable.id, data.chat_id));
    return message;
  }

  async getChatById(chatId: string) {
    const [chat] = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, chatId))
      .limit(1);
    return chat;
  }

  async updateChat(data: UpdateChatDto) {
    const [updatedChat] = await this.db
      .update(chatsTable)
      .set(data)
      .where(eq(chatsTable.id, data.id))
      .returning();
    return updatedChat;
  }

  async deleteChat(chatId: string) {
    return this.db
      .delete(chatsTable)
      .where(eq(chatsTable.id, chatId))
      .returning();
  }
}
