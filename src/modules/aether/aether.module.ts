import { Module } from '@nestjs/common';
import { AetherService } from './aether.service';

@Module({
  providers: [AetherService],
})
export class AetherModule {}
