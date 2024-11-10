import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ScenarioService],
  controllers: [ScenarioController],
})
export class ScenarioModule {}
