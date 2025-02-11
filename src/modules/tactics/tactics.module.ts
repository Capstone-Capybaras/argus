import { Module } from '@nestjs/common';
import { TacticsService } from './tactics.service';
import { TacticsController } from './tactics.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TacticsService],
  controllers: [TacticsController],
})
export class TacticsModule {}
