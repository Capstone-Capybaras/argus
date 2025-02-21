import { Controller, Get, Post, Body } from '@nestjs/common';
import { InboxDto } from './imap.dto';
import { ImapService } from './email.imap.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('imap')
export class ImapController {
  constructor(private readonly imapService: ImapService) {}

  @Post('getMail')
  async getMail(@Body() inboxDto: InboxDto) {
    const mails = await this.imapService.openInbox(
      inboxDto.threadTopic,
      inboxDto.date,
      inboxDto.take,
      inboxDto.skip,
    );
    return { mails: mails };
  }

  @Get('disconnect')
  async disconnectImap() {
    await this.imapService.closeConnection();
    return { message: 'connection closed' };
  }
}
