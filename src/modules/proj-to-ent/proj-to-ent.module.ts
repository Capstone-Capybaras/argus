import { Module } from '@nestjs/common';
import { ProjToEntService } from './proj-to-ent.service';
import { ProjToEntController } from './proj-to-ent.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProjToEntService],
  controllers: [ProjToEntController],
})
export class ProjToEntModule {}
