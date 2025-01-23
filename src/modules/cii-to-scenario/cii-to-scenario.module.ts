import { Module } from '@nestjs/common';
import { CiiToScenarioService } from './cii-to-scenario.service';
import { CiiToScenarioController } from './cii-to-scenario.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CiiToScenarioService],
  controllers: [CiiToScenarioController],
})
export class CiiToScenarioModule {}
