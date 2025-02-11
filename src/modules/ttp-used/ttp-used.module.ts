import { Module } from '@nestjs/common';
import { TtpUsedService } from './ttp-used.service';
import { TtpUsedController } from './ttp-used.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TtpUsedService],
  controllers: [TtpUsedController],
})
export class TtpUsedModule {}
