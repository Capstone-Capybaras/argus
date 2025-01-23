import { Test, TestingModule } from '@nestjs/testing';
import { CiiToScenarioService } from './cii-to-scenario.service';

describe('CiiToScenarioService', () => {
  let service: CiiToScenarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CiiToScenarioService],
    }).compile();

    service = module.get<CiiToScenarioService>(CiiToScenarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
