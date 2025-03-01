import { Module } from '@nestjs/common';
import { ThreatLandscapeService } from './threat-landscape.service';
import { ThreatLandscapeController } from './threat-landscape.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AetherModule } from '../aether/aether.module';
import { RedisModule } from 'src/email/redis/redis.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [DatabaseModule, AetherModule, RedisModule, JobsModule],
  providers: [ThreatLandscapeService],
  controllers: [ThreatLandscapeController],
})
export class ThreatLandscapeModule {}
