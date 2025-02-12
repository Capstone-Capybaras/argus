import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullQueueController } from './bullqueue.controller';
import { BullQueueService } from './bullqueue.service';
import { EmailProcessor } from './bullqueue.process';
import { EmailModule } from './email.module';
import { ServerSelectorModule } from './server-selector/server-selector.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    EmailModule,
    ServerSelectorModule,
  ],
  controllers: [BullQueueController],
  providers: [BullQueueService, EmailProcessor],
  exports: [BullQueueService],
})
export class BullQueueModule {}
