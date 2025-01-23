import { Module } from '@nestjs/common';
import { RolesToInjectService } from './roles-to-inject.service';
import { RolesToInjectController } from './roles-to-inject.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RolesToInjectService],
  controllers: [RolesToInjectController],
})
export class RolesToInjectModule {}
