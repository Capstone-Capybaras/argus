import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('removeAttachment')
  async removeAttachment(
    @Query('emailId', ParseIntPipe) emailId: number,
    @Query('key') key: string,
  ) {
    try {
      const result = await this.emailService.removeAttachment(emailId, key);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  @Get(':projectId')
  async getAllEmails(@Param('projectId', ParseIntPipe) projectId: number) {
    const emails = await this.emailService.getEmailsByProject(projectId);
    return { emails: emails };
  }

  @Get('getOne/:emailId')
  async getMail(@Param('emailId', ParseIntPipe) emailId: number) {
    try {
      const mail = await this.emailService.getEmailsById(emailId);
      return {
        message: 'success',
        mail: mail,
      };
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  @Get('sendOne/:emailId')
  async sendMailer(@Param('emailId', ParseIntPipe) emailId: number) {
    try {
      const mail = await this.emailService.sendMail(emailId);
      return {
        message: 'success',
        mail,
      };
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  @Get('deleteEmail/:emailId')
  async deleteEmail(@Param('emailId', ParseIntPipe) emailId: number) {
    try {
      const mail = await this.emailService.deleteEmail(emailId);
      return mail;
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  @Get('addAttachment')
  async addAttachment(
    @Query('emailId') emailId: number,
    @Query('keys') key: string[],
  ) {
    try {
      const result = await this.emailService.addAttachment(emailId, key);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }
}
