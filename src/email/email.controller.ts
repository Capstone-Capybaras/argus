import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test')
  async getAll() {
    //const emails = await this.emailService.sendMail(1);
    //const emails = await this.emailService.getEmailsByProject(1);
    //const emailId = 4
    //const data = { job_id: 1, schedule_date_time: new Date(), status:"scheduled" }
    //const emails = await this.emailService.updateEmail(emailId, data);
    const resp = await this.emailService.sendTest();
    //const del = await this.emailService.deleteEmailByProj(1);
    return { emails: resp.resp };
  }

  @Get(':projectId')
  async getAllEmails(@Param('projectId', ParseIntPipe) projectId: number) {
    const emails = await this.emailService.getEmailsByProject(projectId);
    return { emails: emails };
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
}
