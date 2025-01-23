import { Module } from '@nestjs/common';
import { CiiService } from './cii.service';
import { CiiController } from './cii.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CiiService],
  controllers: [CiiController],
})
export class CiiModule {}
