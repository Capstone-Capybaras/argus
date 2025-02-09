import { Module } from '@nestjs/common';
import { SenderService } from './server.service';
import { SenderController } from './server.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SenderService],
  controllers: [SenderController],
})
export class SenderModule {}
