import { Test, TestingModule } from '@nestjs/testing';
import { MtcToScenarioController } from './mtc-to-scenario.controller';

describe('MtcToScenarioController', () => {
  let controller: MtcToScenarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtcToScenarioController],
    }).compile();

    controller = module.get<MtcToScenarioController>(MtcToScenarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
