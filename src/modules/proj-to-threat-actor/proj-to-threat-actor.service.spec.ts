import { Test, TestingModule } from '@nestjs/testing';
import { ProjToThreatActorService } from './proj-to-threat-actor.service';

describe('ProjToThreatActorService', () => {
  let service: ProjToThreatActorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjToThreatActorService],
    }).compile();

    service = module.get<ProjToThreatActorService>(ProjToThreatActorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
