import { Test, TestingModule } from '@nestjs/testing';
import { CiiToScenarioController } from './cii-to-scenario.controller';

describe('CiiToScenarioController', () => {
  let controller: CiiToScenarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiiToScenarioController],
    }).compile();

    controller = module.get<CiiToScenarioController>(CiiToScenarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
