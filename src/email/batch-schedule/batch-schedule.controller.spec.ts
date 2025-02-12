import { Test, TestingModule } from '@nestjs/testing';
import { BatchScheduleController } from './batch-schedule.controller';

describe('BatchScheduleController', () => {
  let controller: BatchScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchScheduleController],
    }).compile();

    controller = module.get<BatchScheduleController>(BatchScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
