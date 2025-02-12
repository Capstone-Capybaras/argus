import { Module } from '@nestjs/common';
import { ServerSelectorService } from './server-selector.service';
import { ServerSelectorController } from './server-selector.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServerSelectorService],
  controllers: [ServerSelectorController],
  exports: [ServerSelectorService],
})
export class ServerSelectorModule {}
