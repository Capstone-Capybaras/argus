import { Test, TestingModule } from '@nestjs/testing';
import { MasterThreatCubesService } from './master-threat-cubes.service';

describe('MasterThreatCubesService', () => {
  let service: MasterThreatCubesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterThreatCubesService],
    }).compile();

    service = module.get<MasterThreatCubesService>(MasterThreatCubesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
