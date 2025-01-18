import { Module } from '@nestjs/common';
import { EntToThreatCubesController } from './ent-to-threat-cubes.controller';
import { EntToThreatCubesService } from './ent-to-threat-cubes.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EntToThreatCubesController],
  providers: [EntToThreatCubesService],
})
export class EntToThreatCubesModule {}
