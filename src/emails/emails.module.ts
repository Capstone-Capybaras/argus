import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { SnsModule } from 'src/sns.module';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService],
  imports: [SnsModule],
})
export class EmailsModule {}
