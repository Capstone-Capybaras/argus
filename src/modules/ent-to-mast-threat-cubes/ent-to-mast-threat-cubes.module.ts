import { Module } from '@nestjs/common';
import { EntToMastThreatCubesService } from './ent-to-mast-threat-cubes.service';
import { EntToMastThreatCubesController } from './ent-to-mast-threat-cubes.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EntToMastThreatCubesService],
  controllers: [EntToMastThreatCubesController],
})
export class EntToMastThreatCubesModule {}
