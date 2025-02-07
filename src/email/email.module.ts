import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from './s3.module';

@Module({
  imports: [
    DatabaseModule,
    S3Module,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 465, //587 not secure
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
