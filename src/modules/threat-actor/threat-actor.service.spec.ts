import { Test, TestingModule } from '@nestjs/testing';
import { ThreatActorService } from './threat-actor.service';

describe('ThreatActorService', () => {
  let service: ThreatActorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreatActorService],
    }).compile();

    service = module.get<ThreatActorService>(ThreatActorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
