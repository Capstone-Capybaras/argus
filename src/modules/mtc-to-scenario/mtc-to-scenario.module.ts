import { Module } from '@nestjs/common';
import { MtcToScenarioService } from './mtc-to-scenario.service';
import { MtcToScenarioController } from './mtc-to-scenario.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MtcToScenarioService],
  controllers: [MtcToScenarioController],
})
export class MtcToScenarioModule {}
