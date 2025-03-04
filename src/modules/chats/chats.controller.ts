import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SelectChatDto } from './dto/select-chat.dto';
import { ChatsService } from './chats.service';
import { User, UserInfo } from '../auth/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { SelectChatMessageDto } from './dto/select-chat-message.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async getChats(@User() user: UserInfo): Promise<SelectChatDto[]> {
    try {
      return await this.chatsService.getChatsForUser(user.sub);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post()
  async createChat(
    @User() user: UserInfo,
    @Body() createChatDto: CreateChatDto,
  ): Promise<SelectChatDto> {
    try {
      return await this.chatsService.createChat(user.sub, createChatDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Patch()
  async updateChat(
    @User() user: UserInfo,
    @Body() updateChatDto: UpdateChatDto,
  ): Promise<SelectChatDto> {
    let chat: SelectChatDto | undefined;
    try {
      chat = await this.chatsService.getChatById(updateChatDto.id);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (chat.user_id !== user.sub) {
      throw new ForbiddenException(
        'Trying to edit a chat associated with another user',
      );
    }

    try {
      return await this.chatsService.updateChat(updateChatDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Delete(':chatId')
  async deleteChat(
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ): Promise<boolean> {
    try {
      const deletedChats = await this.chatsService.deleteChat(chatId);
      return deletedChats.length > 0;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('messages/:chatId')
  async getMessages(
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ): Promise<SelectChatMessageDto[]> {
    try {
      return await this.chatsService.getMessagesForChat(chatId);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('messages')
  async createMessage(
    @Body() createChatMessageDto: CreateChatMessageDto,
  ): Promise<SelectChatMessageDto> {
    try {
      return await this.chatsService.createMessage(createChatMessageDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
