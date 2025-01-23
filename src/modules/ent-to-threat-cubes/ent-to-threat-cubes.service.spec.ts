import { Test, TestingModule } from '@nestjs/testing';
import { EntToThreatCubesService } from './ent-to-threat-cubes.service';

describe('EntToThreatCubesService', () => {
  let service: EntToThreatCubesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntToThreatCubesService],
    }).compile();

    service = module.get<EntToThreatCubesService>(EntToThreatCubesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
