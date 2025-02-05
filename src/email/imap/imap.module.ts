import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ImapService } from './email.imap.service';
import { ImapController } from './imap.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
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
      inject: [ConfigService],
    })],
  providers: [ImapService],
  controllers: [ImapController],
  exports: [ImapService]
})
export class ImapModule {}
