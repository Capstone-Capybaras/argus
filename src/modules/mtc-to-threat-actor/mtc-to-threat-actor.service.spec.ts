import { Test, TestingModule } from '@nestjs/testing';
import { MtcToThreatActorService } from './mtc-to-threat-actor.service';

describe('MtcToThreatActorService', () => {
  let service: MtcToThreatActorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MtcToThreatActorService],
    }).compile();

    service = module.get<MtcToThreatActorService>(MtcToThreatActorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
