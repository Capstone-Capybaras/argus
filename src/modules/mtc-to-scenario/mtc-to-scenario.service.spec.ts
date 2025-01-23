import { Test, TestingModule } from '@nestjs/testing';
import { MtcToScenarioService } from './mtc-to-scenario.service';

describe('MtcToScenarioService', () => {
  let service: MtcToScenarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtcToScenarioService],
    }).compile();

    service = module.get<MtcToScenarioService>(MtcToScenarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
