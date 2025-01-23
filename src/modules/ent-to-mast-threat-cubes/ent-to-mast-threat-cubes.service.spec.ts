import { Test, TestingModule } from '@nestjs/testing';
import { EntToMastThreatCubesService } from './ent-to-mast-threat-cubes.service';

describe('EntToMastThreatCubesService', () => {
  let service: EntToMastThreatCubesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntToMastThreatCubesService],
    }).compile();

    service = module.get<EntToMastThreatCubesService>(
      EntToMastThreatCubesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
