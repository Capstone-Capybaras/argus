import { Test, TestingModule } from '@nestjs/testing';
import { InjectsController } from './injects.controller';

describe('InjectsController', () => {
  let controller: InjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InjectsController],
    }).compile();

    controller = module.get<InjectsController>(InjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
