import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Processor('emailSending')
export class EmailProcessor {
    constructor(
        private readonly emailService: EmailService,
        private readonly mailService: MailerService
    ) {}
    @Process("sendEmail")
    async sendEmail(job: Job) {
        console.log("######### PRINT DATA IN PROCESSOR #########")
        console.log(job);
        const emailId = job.data.email;
        this.emailService.sendMail(emailId);
    }
}
