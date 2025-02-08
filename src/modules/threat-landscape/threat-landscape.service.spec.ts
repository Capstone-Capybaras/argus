import { Test, TestingModule } from '@nestjs/testing';
import { ThreatLandscapeService } from './threat-landscape.service';

describe('ThreatLandscapeService', () => {
  let service: ThreatLandscapeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreatLandscapeService],
    }).compile();

    service = module.get<ThreatLandscapeService>(ThreatLandscapeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
