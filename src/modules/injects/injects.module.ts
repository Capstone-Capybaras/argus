import { Module } from '@nestjs/common';
import { InjectsService } from './injects.service';
import { InjectsController } from './injects.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InjectsService],
  controllers: [InjectsController],
})
export class InjectsModule {}
