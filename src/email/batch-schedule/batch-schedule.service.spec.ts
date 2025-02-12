import { Test, TestingModule } from '@nestjs/testing';
import { BatchScheduleService } from './batch-schedule.service';

describe('BatchScheduleService', () => {
  let service: BatchScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchScheduleService],
    }).compile();

    service = module.get<BatchScheduleService>(BatchScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
