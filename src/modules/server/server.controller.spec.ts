import { Test, TestingModule } from '@nestjs/testing';
import { SenderController } from './server.controller';

describe('SenderController', () => {
  let controller: SenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SenderController],
    }).compile();

    controller = module.get<SenderController>(SenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
