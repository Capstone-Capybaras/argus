import { Module } from '@nestjs/common';
import { MasterThreatCubesService } from './master-threat-cubes.service';
import { MasterThreatCubesController } from './master-threat-cubes.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MasterThreatCubesService],
  controllers: [MasterThreatCubesController],
})
export class MasterThreatCubesModule {}
