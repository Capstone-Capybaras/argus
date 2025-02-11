import { Test, TestingModule } from '@nestjs/testing';
import { TtpUsedController } from './ttp-used.controller';

describe('TtpUsedController', () => {
  let controller: TtpUsedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtpUsedController],
    }).compile();

    controller = module.get<TtpUsedController>(TtpUsedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
