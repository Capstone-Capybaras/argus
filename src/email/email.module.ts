import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from './s3.module';
import { ConfigService } from '@nestjs/config';
import { ServerSelectorService } from './server-selector/server-selector.service';
import { ServerSelectorModule } from './server-selector/server-selector.module';
//import { ServerSelectorService } from './server-selector/server-selector.service';

@Module({
  imports: [
    DatabaseModule,
    S3Module,
    ServerSelectorModule,
    MailerModule.forRootAsync({
      imports: [ServerSelectorModule],
      inject: [ServerSelectorService],
      useFactory: async (selectorService: ServerSelectorService) => {
        return {
          transport: await selectorService.getEmailConfig() // Dynamic transport
        };
      },
    }),
  ],
  providers: [EmailService, ServerSelectorService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
